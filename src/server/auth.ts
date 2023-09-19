import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import { compare } from "bcryptjs";
import { List, type User } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      image: string;
      // ...other properties
      // role: UserRole;
    };
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}


const ListType = {
  like: {
    name: 'like',
    description: 'Likedlist'
  },
  watched: {
    name: 'watched',
    description: 'Watchlist'
  },
  favorite: {
    name: 'favorite',
    description: 'Favorites'
  }
}

/**
 * Returns a list object
 */
const generateLists = ({ type, user }: { type: 'like' | 'watched' | 'favorite' , user: User}) => {
  return {
    type,
    dateCreated: new Date(),
    userId: user?.id,
    title: user?.name + "'s" + ListType[type].description,
  };
};

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.sub,
        image: token.picture,
      },
    }),
    async jwt({ token, trigger }) {
      if (trigger === "update") {
        const user = await prisma?.user.findFirst({
          where: {
            id: token.sub,
          },
        });
        token.name = user?.name;
        token.picture = user?.image;
      }
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
    CredentialsProvider({
      name: "Credential",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "Enter your name!",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) {
          return null;
        }

        const user = await prisma?.user.findFirst({
          where: {
            name: credentials.username,
          },
        });

        if (
          !user?.hashedPassword ||
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          !(await compare(credentials.password, user.hashedPassword))
        ) {
          return null;
        }

        // Check if starterlists exists.
        const list: ('like' | 'watched' | 'favorite')[] = [];
        const w = await prisma.list.count({
          where: {
            type: 'watch',
            userId: user.id
          }
        });

        const f = await prisma.list.count({
          where: {
            type: 'favorite',
            userId: user.id
          }
        });

        const l = await prisma.list.count({
          where: {
            type: 'like',
            userId: user.id
          }
        });

        if(w === 0) {
          list.push('watched')
        }
        if(f === 0) {
          list.push('like')
        }
        if(l === 0) {
          list.push('favorite')
        }
    
        // Create lists.
        await prisma?.list.createMany({
          data: list.map((item) => generateLists({type: item, user: user} ))
          
        });

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    createUser: async ({ user }) => {
      // Create three lists: liked, favorited (5 max), watch
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
