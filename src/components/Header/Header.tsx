/* eslint-disable @next/next/no-img-element */
import React, { useState } from "react";

import { Fragment } from "react";
import { Menu, Popover, Transition } from "@headlessui/react";
import { Button } from "../Button/Button";
import Link from "next/link";
import { Search } from "../Search/Search";
import { signOut, useSession } from "next-auth/react";
import { WatchModal } from "../WatchModal/WatchModal";
import { Login } from "../Login/Login";
import { api } from "~/utils/api";

enum BUTTON_SIZES {
  xs = "px-2 py-1 text-xs",
  sm = "px-2 py-1 text-sm",
  md = "px-2.5 py-1.5 text-sm",
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Primary UI component for user interaction
 */
export const Header = () => {
  const { data: sessionData } = useSession();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [login, setLogin] = useState(false);

  /**
   * Opens watch modal.
   */
  function openModal() {
    setIsOpen(true);
  }

  /**
   * Close watch modal.
   */
  function closeModal() {
    setIsOpen(false);
  }

  /**
   * Opens login modal.
   */
  function openLoginModal() {
    setLogin(true);
  }

  /**
   * Closes login modal.
   */
  function closeLoginModal() {
    setLogin(false);
  }

  const globaNavigation = [{ name: "Lists", href: "/lists" }];

  const userNavigation = [
    { name: "Log Watch", href: "#", onClick: openModal },
    { name: "My Lists", href: "/" + sessionData?.user?.name + "/lists" },
    { name: "Profile", href: "/" + sessionData?.user?.name },
    { name: "Settings", href: "/settings" },
    { name: "Sign Out", href: "#", onClick: signOut },
  ];

  return (
    <>
      {modalIsOpen && (
        <WatchModal modalIsOpen={modalIsOpen} closeModal={closeModal} />
      )}
      {login && <Login modalIsOpen={login} closeModal={closeLoginModal} />}
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={({ open }) =>
          classNames(
            open ? "z-60 fixed inset-0 overflow-y-auto" : "",
            "bg-white shadow-sm lg:static lg:overflow-y-visible"
          )
        }
      >
        {({ open }) => (
          <>
            <div className="mx-auto  bg-gray-800 px-4 sm:px-6 lg:px-8">
              <div className="relative flex justify-between gap-8 xl:grid xl:grid-cols-12">
                <div className="flex md:absolute md:inset-y-0 md:left-0 lg:static xl:col-span-2">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href={"/"}>
                      <img
                        className="h-8 w-auto"
                        src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
                        alt="Your Company"
                      />
                    </Link>
                  </div>
                </div>
                <div className="min-w-0 flex-1 md:px-8 lg:px-0 xl:col-span-8">
                  <div className="flex items-center px-6 py-4 md:mx-auto md:max-w-4xl lg:mx-0 lg:max-w-none xl:px-0">
                    <div className="w-full">
                      <label htmlFor="search" className="sr-only">
                        Search
                      </label>
                      <div className="relative">
                        <Search />
                      </div>
                    </div>
                  </div>
                </div>

                {sessionData ? (
                  <div className="flex items-center justify-end xl:col-span-2">
                    <Menu as="div" className="relative ml-5 flex-shrink-0">
                      <div>
                        <Menu.Button className="flex rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="sr-only">Open user menu</span>
                          {sessionData?.user?.image ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={sessionData?.user?.image}
                              alt=""
                            />
                          ) : (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={""}
                              alt=""
                            />
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right divide-y divide-gray-100 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          <div className="px-4 py-3">
                            <p className="text-sm">Signed in as</p>
                            <p className="truncate text-sm font-medium text-gray-900">
                              {sessionData?.user?.name}
                            </p>
                          </div>
                          <div className="">
                            {globaNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                          <div className="">
                            {userNavigation.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    onClick={
                                      item.onClick
                                        ? () => item.onClick()
                                        : undefined
                                    }
                                    className={classNames(
                                      active ? "bg-gray-100" : "",
                                      "block px-4 py-2 text-sm text-gray-700"
                                    )}
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ) : (
                  <div className="flex items-center justify-end xl:col-span-2">
                    <Button
                      size={BUTTON_SIZES.md}
                      variant={"primary"}
                      label="Sign In"
                      className={""}
                      onClick={() => openLoginModal()}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Popover>
    </>
  );
};
