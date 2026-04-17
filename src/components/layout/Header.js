import React, { useState } from "react";
import { Search, Bell, X, Check, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import Dropdown, { DropdownItem } from "../common/Dropdown";
import Button from "../common/Button";

const Header = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { t, language, setLanguage } = useLanguage();
  // ... notifications ...
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      text: "Dr. Smith uploaded new test results for John Doe.",
      time: "10m ago",
      unread: true,
    },
    {
      id: 2,
      text: "Your upcoming appointment with Sarah Jenkins has been rescheduled.",
      time: "2h ago",
      unread: true,
    },
    {
      id: 3,
      text: "System maintenance scheduled for tonight at 2AM.",
      time: "1d ago",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markSelectedAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  return (
    <header className="h-[72px] border-b border-border-light flex items-center justify-between px-8 bg-bg-main shrink-0">
      {/* Empty div for flexbox spacing (left) */}
      <div className="w-10"></div>

      <div className="flex-grow flex justify-center px-4">
        <div className="flex items-center gap-2 bg-border-subtle px-4 py-2.5 rounded-full w-full max-w-2xl border border-transparent transition-all focus-within:bg-bg-main focus-within:border-primary focus-within:ring-4 focus-within:ring-primary-light">
          <Search size={18} className="text-text-muted shrink-0" />
          <input
            type="text"
            className="bg-transparent border-none outline-none w-full text-sm text-text-dark placeholder:text-text-muted"
            placeholder={t("search_placeholder")}
          />
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0 relative z-50">
        <Dropdown
          align="right"
          className="w-32"
          trigger={
            <button
              className="relative w-10 h-10 flex items-center justify-center border border-border-light rounded-full text-text-muted transition-all hover:bg-border-subtle hover:text-text-dark shrink-0"
              title="Change Language">
              <Globe size={20} />
            </button>
          }>
          <DropdownItem
            onClick={() => setLanguage("en")}
            className={language === "en" ? "font-bold" : ""}>
            English
          </DropdownItem>
          <DropdownItem
            onClick={() => setLanguage("fr")}
            className={language === "fr" ? "font-bold" : ""}>
            Français
          </DropdownItem>
          <DropdownItem
            onClick={() => setLanguage("ar")}
            className={language === "ar" ? "font-bold" : ""}>
            العربية
          </DropdownItem>
        </Dropdown>

        <button
          onClick={toggleTheme}
          className="relative w-10 h-10 flex items-center justify-center border border-border-light rounded-full text-text-muted transition-all hover:bg-border-subtle hover:text-text-dark shrink-0"
          title="Toggle theme">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <Dropdown
          align="right"
          className="w-80"
          trigger={
            <div className="relative w-10 h-10 flex items-center justify-center border border-border-light rounded-full text-text-muted transition-all hover:bg-border-subtle hover:text-text-dark shrink-0">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-danger rounded-full border-2 border-bg-main"></span>
              )}
            </div>
          }>
          <div
            keepOpen
            className="w-80 max-h-[80vh] flex flex-col overflow-hidden bg-bg-card shadow-lg border border-border-light rounded-lg">
            <div className="p-4 border-b border-border-light flex justify-between items-center bg-border-subtle">
              <h3 className="font-semibold text-text-dark">
                {t("notifications")}
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAllAsRead();
                  }}
                  className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                  <Check size={12} /> {t("mark_all_read")}
                </button>
              )}
            </div>
            <div className="overflow-y-auto max-h-[400px]">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-muted">
                  {t("no_notifications")}
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-border-subtle last:border-0 hover:bg-border-subtle transition-colors cursor-pointer flex gap-4 \${notif.unread ? 'bg-primary-light/10' : ''}`}
                    onClick={() => markSelectedAsRead(notif.id)}>
                    <div className="flex-grow">
                      <p
                        className={`text-sm \${notif.unread ? 'font-medium text-text-dark' : 'text-text-muted'}`}>
                        {notif.text}
                      </p>
                      <span className="text-xs text-text-muted mt-1 block">
                        {notif.time}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dismissNotification(notif.id);
                      }}
                      className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity p-1 self-start"
                      title={t("dismiss")}>
                      <X size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
