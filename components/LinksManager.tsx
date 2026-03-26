"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  getUserLinks,
  createLink,
  updateLink,
  deleteLink,
  LinkItem,
} from "@/lib/db";
import { Trash2, Plus, Link as LinkIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Spinner } from "@/components/Spinner";
import toast from "react-hot-toast";
import { v4 as uuid4 } from "uuid";

export default function LinksManager() {
  const { user } = useAuth();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New link form state
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const loadLinks = async () => {
    if (user) {
      const data = await getUserLinks(user.uid);
      setLinks(data);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLinks();
  }, [user]);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newTitle || !newUrl) return;

    setAdding(true);
    try {
      const linkId = uuid4();
      await createLink(linkId, {
        userId: user.uid,
        title: newTitle,
        url: newUrl,
        isActive: true,
        order: links.length,
      });
      setNewTitle("");
      setNewUrl("");
      await loadLinks();
      toast.success("Link added successfully!");
    } catch (error: any) {
      console.error("Failed to add link", error);
      toast.error(error.message || "Failed to add link");
    } finally {
      setAdding(false);
    }
  };

  const handleToggleActive = async (link: LinkItem) => {
    if (!link.id) return;
    try {
      // Optimistic update
      setLinks(
        links.map((l) =>
          l.id === link.id ? { ...l, isActive: !l.isActive } : l,
        ),
      );
      await updateLink(link.id, { isActive: !link.isActive });
      toast.success(`Link ${!link.isActive ? "activated" : "deactivated"}`);
    } catch (error: any) {
      console.error("Failed to toggle link", error);
      toast.error(error.message || "Failed to toggle link");
      await loadLinks(); // Revert on failure
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLinks(links.filter((l) => l.id !== id));
      await deleteLink(id);
      toast.success("Link deleted successfully!");
    } catch (error: any) {
      console.error("Failed to delete link", error);
      toast.error(error.message || "Failed to delete link");
      await loadLinks(); // Revert on failure
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white shadow rounded-lg p-4 animate-pulse flex items-center justify-between"
            >
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-10 h-6 bg-gray-200 rounded-full ml-4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add New Link Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-5 h-5 mr-2 text-indigo-600" />
          Add New Link
        </h2>
        <form onSubmit={handleAddLink} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="text"
                required
                placeholder="Title (e.g., My Portfolio)"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <input
                type="url"
                required
                placeholder="URL (e.g., https://example.com)"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={adding || !newTitle || !newUrl}
            className="w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {adding ? (
              <>
                <Spinner className="mr-2" /> Adding...
              </>
            ) : (
              "Add Link"
            )}
          </button>
        </form>
      </motion.div>

      {/* Links List */}
      <div className="space-y-3">
        {links.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 bg-white shadow rounded-lg border-2 border-dashed border-gray-300"
          >
            <LinkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No links</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new link above.
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {links.map((link) => (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: "auto", marginBottom: 12 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white shadow rounded-lg p-4 flex items-center justify-between transition-all hover:shadow-md overflow-hidden"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {link.title}
                  </h3>
                  <p className="text-sm text-gray-500 truncate">{link.url}</p>
                </div>

                <div className="flex items-center space-x-4 flex-shrink-0">
                  <label className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={link.isActive}
                        onChange={() => handleToggleActive(link)}
                      />
                      <div
                        className={`block w-10 h-6 rounded-full transition-colors ${link.isActive ? "bg-green-500" : "bg-gray-300"}`}
                      ></div>
                      <div
                        className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${link.isActive ? "transform translate-x-4" : ""}`}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600 hidden sm:block">
                      {link.isActive ? "Visible" : "Hidden"}
                    </span>
                  </label>

                  <button
                    onClick={() => link.id && handleDelete(link.id)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
                    aria-label="Delete link"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
