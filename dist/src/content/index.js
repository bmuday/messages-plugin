import { n as normalizeUrl, h as hashUrl } from "../../assets/url-utils-CAMNiPlT.js";
import { d as defineStore, r as ref, c as computed, _ as _export_sfc, a as createElementBlock, b as createBaseVNode, t as toDisplayString, e as createCommentVNode, o as openBlock, F as Fragment, f as renderList, n as normalizeClass, u as unref, w as withDirectives, v as vModelText, g as withKeys, h as withModifiers, i as createBlock, j as useAuthStore, k as useCommunitiesStore, l as vModelSelect, m as createVNode, p as onMounted, q as onUnmounted, s as createPinia, x as createApp } from "../../assets/_plugin-vue_export-helper-D5iCt8v-.js";
const EMOJIS = [
  { id: "heart", emoji: "❤️", label: "Love" },
  { id: "laugh", emoji: "😂", label: "Funny" },
  { id: "wow", emoji: "😮", label: "Wow" },
  { id: "fire", emoji: "🔥", label: "Fire" },
  { id: "idea", emoji: "💡", label: "Insightful" },
  { id: "dislike", emoji: "👎", label: "Dislike" }
];
EMOJIS.reduce((acc, { id, emoji }) => {
  acc[id] = emoji;
  return acc;
}, {});
EMOJIS.reduce((acc, { id, emoji }) => {
  acc[emoji] = id;
  return acc;
}, {});
const useReactionsStore = defineStore("reactions", () => {
  const currentPageReactions = ref([]);
  const userReaction = ref(null);
  const reactionCounts = ref({});
  const isLoading = ref(false);
  const error = ref(null);
  const currentPageId = ref(null);
  const totalReactions = computed(() => currentPageReactions.value.length);
  const reactionsByEmoji = computed(() => {
    return currentPageReactions.value.reduce((acc, reaction) => {
      const emoji = reaction.emoji;
      if (!acc[emoji]) {
        acc[emoji] = [];
      }
      acc[emoji].push(reaction);
      return acc;
    }, {});
  });
  const hasUserReacted = computed(() => userReaction.value !== null);
  const userReactionEmoji = computed(() => {
    var _a;
    return ((_a = userReaction.value) == null ? void 0 : _a.emoji) || null;
  });
  async function fetchReactionsForPage(pageId, options = {}) {
    isLoading.value = true;
    error.value = null;
    currentPageId.value = pageId;
    try {
      const response = await sendMessage$1("REACTION_GET_FOR_PAGE", { pageId, options });
      if (response.success) {
        currentPageReactions.value = response.data;
        updateReactionCounts();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      error.value = err.message;
      console.error("Failed to fetch reactions:", err);
    } finally {
      isLoading.value = false;
    }
  }
  async function fetchUserReaction(pageId, userId) {
    try {
      const response = await sendMessage$1("REACTION_GET_USER_FOR_PAGE", { pageId, userId });
      if (response.success) {
        userReaction.value = response.data;
      }
    } catch (err) {
      console.error("Failed to fetch user reaction:", err);
    }
  }
  async function addReaction(pageId, emoji, comment, communityId, userId) {
    isLoading.value = true;
    error.value = null;
    try {
      if (userReaction.value) {
        return await updateReaction(userReaction.value.$id, { emoji, comment });
      }
      const response = await sendMessage$1("REACTION_CREATE", {
        pageId,
        emoji,
        comment,
        communityId,
        userId
      });
      if (response.success) {
        const newReaction = response.data;
        currentPageReactions.value.unshift(newReaction);
        userReaction.value = newReaction;
        updateReactionCounts();
        return newReaction;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function updateReaction(reactionId, updates) {
    var _a;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await sendMessage$1("REACTION_UPDATE", { reactionId, updates });
      if (response.success) {
        const updatedReaction = response.data;
        const index = currentPageReactions.value.findIndex((r) => r.$id === reactionId);
        if (index !== -1) {
          currentPageReactions.value[index] = updatedReaction;
        }
        if (((_a = userReaction.value) == null ? void 0 : _a.$id) === reactionId) {
          userReaction.value = updatedReaction;
        }
        updateReactionCounts();
        return updatedReaction;
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function deleteReaction(reactionId) {
    var _a;
    isLoading.value = true;
    error.value = null;
    try {
      const response = await sendMessage$1("REACTION_DELETE", { reactionId });
      if (response.success) {
        currentPageReactions.value = currentPageReactions.value.filter((r) => r.$id !== reactionId);
        if (((_a = userReaction.value) == null ? void 0 : _a.$id) === reactionId) {
          userReaction.value = null;
        }
        updateReactionCounts();
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      error.value = err.message;
      throw err;
    } finally {
      isLoading.value = false;
    }
  }
  async function toggleEmoji(pageId, emoji, communityId, userId) {
    var _a;
    if (((_a = userReaction.value) == null ? void 0 : _a.emoji) === emoji) {
      await deleteReaction(userReaction.value.$id);
    } else {
      await addReaction(pageId, emoji, "", communityId, userId);
    }
  }
  function updateReactionCounts() {
    const counts = {};
    EMOJIS.forEach(({ emoji }) => {
      counts[emoji] = 0;
    });
    currentPageReactions.value.forEach((reaction) => {
      const emoji = reaction.emoji;
      counts[emoji] = (counts[emoji] || 0) + 1;
    });
    reactionCounts.value = counts;
  }
  function handleRealtimeUpdate(event) {
    const { type, payload } = event;
    if (type === "create") {
      currentPageReactions.value.unshift(payload);
      updateReactionCounts();
    } else if (type === "update") {
      const index = currentPageReactions.value.findIndex((r) => r.$id === payload.$id);
      if (index !== -1) {
        currentPageReactions.value[index] = payload;
        updateReactionCounts();
      }
    } else if (type === "delete") {
      currentPageReactions.value = currentPageReactions.value.filter((r) => r.$id !== payload.$id);
      updateReactionCounts();
    }
  }
  function clearError() {
    error.value = null;
  }
  return {
    // State
    currentPageReactions,
    userReaction,
    reactionCounts,
    isLoading,
    error,
    currentPageId,
    // Getters
    totalReactions,
    reactionsByEmoji,
    hasUserReacted,
    userReactionEmoji,
    // Actions
    fetchReactionsForPage,
    fetchUserReaction,
    addReaction,
    updateReaction,
    deleteReaction,
    toggleEmoji,
    handleRealtimeUpdate,
    clearError
  };
});
function sendMessage$1(type, data = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, data }, (response) => {
      resolve(response);
    });
  });
}
const useUiStore = defineStore("ui", () => {
  const isPanelOpen = ref(false);
  const isLoading = ref(false);
  const error = ref(null);
  const notification = ref(null);
  function togglePanel() {
    isPanelOpen.value = !isPanelOpen.value;
  }
  function openPanel() {
    isPanelOpen.value = true;
  }
  function closePanel() {
    isPanelOpen.value = false;
  }
  function setLoading(loading) {
    isLoading.value = loading;
  }
  function setError(errorMessage) {
    error.value = errorMessage;
  }
  function clearError() {
    error.value = null;
  }
  function showNotification(message, type = "info") {
    notification.value = { message, type };
    setTimeout(() => {
      notification.value = null;
    }, 3e3);
  }
  function clearNotification() {
    notification.value = null;
  }
  return {
    // State
    isPanelOpen,
    isLoading,
    error,
    notification,
    // Actions
    togglePanel,
    openPanel,
    closePanel,
    setLoading,
    setError,
    clearError,
    showNotification,
    clearNotification
  };
});
const _hoisted_1$6 = {
  key: 0,
  class: "badge"
};
const _sfc_main$6 = {
  __name: "FloatingButton",
  props: {
    count: {
      type: Number,
      default: 0
    }
  },
  emits: ["click"],
  setup(__props) {
    const props = __props;
    const displayCount = computed(() => {
      if (props.count > 99) {
        return "99+";
      }
      return props.count;
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("button", {
        class: "floating-button",
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("click")),
        title: "EmojiFeed - React to this page"
      }, [
        _cache[1] || (_cache[1] = createBaseVNode("span", { class: "button-icon" }, "🎭", -1)),
        __props.count > 0 ? (openBlock(), createElementBlock("span", _hoisted_1$6, toDisplayString(displayCount.value), 1)) : createCommentVNode("", true)
      ]);
    };
  }
};
const FloatingButton = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-08a69b51"]]);
const _hoisted_1$5 = { class: "emoji-picker" };
const _hoisted_2$4 = ["title", "onClick"];
const _hoisted_3$3 = { class: "emoji" };
const _hoisted_4$3 = {
  key: 0,
  class: "emoji-count"
};
const _sfc_main$5 = {
  __name: "EmojiPicker",
  props: {
    counts: {
      type: Object,
      default: () => ({})
    },
    userEmoji: {
      type: String,
      default: null
    }
  },
  emits: ["select"],
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$5, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(unref(EMOJIS), (emojiData) => {
          return openBlock(), createElementBlock("button", {
            key: emojiData.id,
            class: normalizeClass(["emoji-button", { active: __props.userEmoji === emojiData.emoji }]),
            title: emojiData.label,
            onClick: ($event) => _ctx.$emit("select", emojiData.emoji)
          }, [
            createBaseVNode("span", _hoisted_3$3, toDisplayString(emojiData.emoji), 1),
            __props.counts[emojiData.emoji] > 0 ? (openBlock(), createElementBlock("span", _hoisted_4$3, toDisplayString(__props.counts[emojiData.emoji]), 1)) : createCommentVNode("", true)
          ], 10, _hoisted_2$4);
        }), 128))
      ]);
    };
  }
};
const EmojiPicker = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-a4648e05"]]);
const _hoisted_1$4 = { class: "comment-input" };
const _hoisted_2$3 = ["onKeydown"];
const _hoisted_3$2 = { class: "comment-footer" };
const _hoisted_4$2 = { class: "char-counter" };
const _hoisted_5$2 = ["disabled"];
const _sfc_main$4 = {
  __name: "CommentInput",
  emits: ["submit"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    const comment = ref("");
    const canSubmit = computed(() => {
      return comment.value.trim().length > 0 && comment.value.length <= 280;
    });
    function submit() {
      if (!canSubmit.value) return;
      emit("submit", comment.value.trim());
      comment.value = "";
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$4, [
        withDirectives(createBaseVNode("textarea", {
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => comment.value = $event),
          class: "comment-textarea",
          placeholder: "Share your thoughts... (280 characters max)",
          maxlength: "280",
          onKeydown: [
            withKeys(withModifiers(submit, ["ctrl"]), ["enter"]),
            withKeys(withModifiers(submit, ["meta"]), ["enter"])
          ]
        }, null, 40, _hoisted_2$3), [
          [vModelText, comment.value]
        ]),
        createBaseVNode("div", _hoisted_3$2, [
          createBaseVNode("span", _hoisted_4$2, toDisplayString(comment.value.length) + "/280", 1),
          createBaseVNode("button", {
            class: "submit-button",
            disabled: !canSubmit.value,
            onClick: submit
          }, " Post ", 8, _hoisted_5$2)
        ])
      ]);
    };
  }
};
const CommentInput = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-ea5cf1bb"]]);
function formatRelativeTime(date) {
  const now = /* @__PURE__ */ new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1e3);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);
  const diffYear = Math.floor(diffDay / 365);
  if (diffSec < 60) {
    return "just now";
  } else if (diffMin < 60) {
    return `${diffMin}m ago`;
  } else if (diffHour < 24) {
    return `${diffHour}h ago`;
  } else if (diffDay < 7) {
    return `${diffDay}d ago`;
  } else if (diffWeek < 4) {
    return `${diffWeek}w ago`;
  } else if (diffMonth < 12) {
    return `${diffMonth}mo ago`;
  } else {
    return `${diffYear}y ago`;
  }
}
const _hoisted_1$3 = { class: "comment-item" };
const _hoisted_2$2 = { class: "comment-header" };
const _hoisted_3$1 = { class: "avatar" };
const _hoisted_4$1 = { class: "comment-username" };
const _hoisted_5$1 = { class: "comment-time" };
const _hoisted_6$1 = { class: "comment-emoji" };
const _hoisted_7 = {
  key: 0,
  class: "comment-text"
};
const _sfc_main$3 = {
  __name: "CommentItem",
  props: {
    reaction: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const username = computed(() => {
      return props.reaction.userId.substring(0, 8);
    });
    const userInitial = computed(() => {
      return username.value.charAt(0).toUpperCase();
    });
    const relativeTime = computed(() => {
      return formatRelativeTime(props.reaction.createdAt);
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$2, [
          createBaseVNode("div", _hoisted_3$1, toDisplayString(userInitial.value), 1),
          createBaseVNode("span", _hoisted_4$1, toDisplayString(username.value), 1),
          createBaseVNode("span", _hoisted_5$1, toDisplayString(relativeTime.value), 1)
        ]),
        createBaseVNode("div", _hoisted_6$1, toDisplayString(__props.reaction.emoji), 1),
        __props.reaction.comment ? (openBlock(), createElementBlock("div", _hoisted_7, toDisplayString(__props.reaction.comment), 1)) : createCommentVNode("", true)
      ]);
    };
  }
};
const CommentItem = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-294fb5da"]]);
const _hoisted_1$2 = { class: "comment-list" };
const _hoisted_2$1 = {
  key: 0,
  class: "empty-state"
};
const _sfc_main$2 = {
  __name: "CommentList",
  props: {
    reactions: {
      type: Array,
      default: () => []
    }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        __props.reactions.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_2$1, [..._cache[0] || (_cache[0] = [
          createBaseVNode("p", null, "No reactions yet. Be the first! 🎉", -1)
        ])])) : createCommentVNode("", true),
        (openBlock(true), createElementBlock(Fragment, null, renderList(__props.reactions, (reaction) => {
          return openBlock(), createBlock(CommentItem, {
            key: reaction.$id,
            reaction
          }, null, 8, ["reaction"]);
        }), 128))
      ]);
    };
  }
};
const CommentList = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-1e228a2c"]]);
const _hoisted_1$1 = { class: "panel-header" };
const _hoisted_2 = { class: "panel-title" };
const _hoisted_3 = { class: "panel-body" };
const _hoisted_4 = {
  key: 0,
  class: "community-filter"
};
const _hoisted_5 = ["value"];
const _hoisted_6 = {
  key: 2,
  class: "login-prompt"
};
const _sfc_main$1 = {
  __name: "ReactionPanel",
  props: {
    pageData: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const authStore = useAuthStore();
    const reactionsStore = useReactionsStore();
    const communitiesStore = useCommunitiesStore();
    const uiStore = useUiStore();
    const selectedCommunity = ref(null);
    const showLoginModal = ref(false);
    async function onEmojiSelect(emoji) {
      var _a;
      if (!authStore.isAuthenticated) {
        showLoginModal.value = true;
        return;
      }
      const communityId = selectedCommunity.value || ((_a = communitiesStore.allCommunities[0]) == null ? void 0 : _a.$id);
      await reactionsStore.toggleEmoji(
        props.pageData.pageId,
        emoji,
        communityId,
        authStore.user.id
      );
    }
    async function onCommentSubmit(comment) {
      var _a;
      if (!authStore.isAuthenticated) {
        return;
      }
      const communityId = selectedCommunity.value || ((_a = communitiesStore.allCommunities[0]) == null ? void 0 : _a.$id);
      const emoji = reactionsStore.userReactionEmoji || "❤️";
      await reactionsStore.addReaction(
        props.pageData.pageId,
        emoji,
        comment,
        communityId,
        authStore.user.id
      );
    }
    function onCommunityChange() {
      reactionsStore.fetchReactionsForPage(props.pageData.pageId, {
        communityId: selectedCommunity.value
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["reaction-panel", { open: unref(uiStore).isPanelOpen }])
      }, [
        createBaseVNode("div", _hoisted_1$1, [
          createBaseVNode("h2", _hoisted_2, toDisplayString(__props.pageData.title), 1),
          createBaseVNode("button", {
            class: "close-button",
            onClick: _cache[0] || (_cache[0] = (...args) => unref(uiStore).closePanel && unref(uiStore).closePanel(...args)),
            title: "Close"
          }, [..._cache[3] || (_cache[3] = [
            createBaseVNode("span", null, "✕", -1)
          ])])
        ]),
        createBaseVNode("div", _hoisted_3, [
          unref(communitiesStore).allCommunities.length > 0 ? (openBlock(), createElementBlock("div", _hoisted_4, [
            withDirectives(createBaseVNode("select", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => selectedCommunity.value = $event),
              onChange: onCommunityChange
            }, [
              _cache[4] || (_cache[4] = createBaseVNode("option", { value: null }, "All Communities", -1)),
              (openBlock(true), createElementBlock(Fragment, null, renderList(unref(communitiesStore).allCommunities, (community) => {
                return openBlock(), createElementBlock("option", {
                  key: community.$id,
                  value: community.$id
                }, toDisplayString(community.icon) + " " + toDisplayString(community.name), 9, _hoisted_5);
              }), 128))
            ], 544), [
              [vModelSelect, selectedCommunity.value]
            ])
          ])) : createCommentVNode("", true),
          createVNode(EmojiPicker, {
            counts: unref(reactionsStore).reactionCounts,
            "user-emoji": unref(reactionsStore).userReactionEmoji,
            onSelect: onEmojiSelect
          }, null, 8, ["counts", "user-emoji"]),
          unref(authStore).isAuthenticated ? (openBlock(), createBlock(CommentInput, {
            key: 1,
            onSubmit: onCommentSubmit
          })) : (openBlock(), createElementBlock("div", _hoisted_6, [
            _cache[5] || (_cache[5] = createBaseVNode("p", null, "Sign in to add your reaction", -1)),
            createBaseVNode("button", {
              class: "submit-button",
              onClick: _cache[2] || (_cache[2] = ($event) => showLoginModal.value = true)
            }, "Sign In")
          ])),
          createVNode(CommentList, {
            reactions: unref(reactionsStore).currentPageReactions
          }, null, 8, ["reactions"])
        ])
      ], 2);
    };
  }
};
const ReactionPanel = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-c940819e"]]);
const _hoisted_1 = { id: "emojifeed-overlay" };
const _sfc_main = {
  __name: "OverlayApp",
  props: {
    pageData: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const authStore = useAuthStore();
    const reactionsStore = useReactionsStore();
    const communitiesStore = useCommunitiesStore();
    const uiStore = useUiStore();
    onMounted(async () => {
      console.log("OverlayApp mounted for page:", props.pageData);
      await authStore.checkSession();
      await communitiesStore.fetchCommunities();
      if (props.pageData.pageId) {
        await reactionsStore.fetchReactionsForPage(props.pageData.pageId);
        if (authStore.isAuthenticated && authStore.user) {
          await reactionsStore.fetchUserReaction(props.pageData.pageId, authStore.user.id);
        }
      }
    });
    onUnmounted(() => {
      console.log("OverlayApp unmounted");
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createVNode(FloatingButton, {
          count: unref(reactionsStore).totalReactions,
          onClick: unref(uiStore).togglePanel
        }, null, 8, ["count", "onClick"]),
        unref(uiStore).isPanelOpen ? (openBlock(), createBlock(ReactionPanel, {
          key: 0,
          "page-data": __props.pageData
        }, null, 8, ["page-data"])) : createCommentVNode("", true)
      ]);
    };
  }
};
const OverlayApp = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8d8a269a"]]);
async function injectOverlay(pageData) {
  const container = document.createElement("div");
  container.id = "emojifeed-root";
  container.style.cssText = "position: fixed; z-index: 2147483647; top: 0; left: 0; width: 0; height: 0;";
  const shadowRoot = container.attachShadow({ mode: "closed" });
  const mountPoint = document.createElement("div");
  mountPoint.id = "app";
  shadowRoot.appendChild(mountPoint);
  const styleElement = document.createElement("style");
  styleElement.textContent = getOverlayStyles();
  shadowRoot.appendChild(styleElement);
  const pinia = createPinia();
  const app = createApp(OverlayApp, {
    pageData
  });
  app.use(pinia);
  app.mount(mountPoint);
  document.body.appendChild(container);
  console.log("Vue app mounted in shadow DOM");
  return {
    app,
    shadowRoot,
    container,
    unmount: () => {
      app.unmount();
      container.remove();
    }
  };
}
function getOverlayStyles() {
  return `
    /* CSS Reset for Shadow DOM */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    /* CSS Variables */
    :host {
      --primary-color: #6366f1;
      --primary-hover: #4f46e5;
      --background: #ffffff;
      --text: #1f2937;
      --text-light: #6b7280;
      --border: #e5e7eb;
      --shadow: rgba(0, 0, 0, 0.1);
      --shadow-lg: rgba(0, 0, 0, 0.15);
      --danger: #ef4444;
      --success: #10b981;
      --warning: #f59e0b;
    }

    /* Typography */
    #app {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Floating Button */
    .floating-button {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px var(--shadow-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      z-index: 1000;
    }

    .floating-button:hover {
      background: var(--primary-hover);
      transform: scale(1.05);
    }

    .floating-button:active {
      transform: scale(0.95);
    }

    /* Badge */
    .badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: var(--danger);
      color: white;
      border-radius: 12px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 600;
      min-width: 20px;
      text-align: center;
    }

    /* Panel */
    .reaction-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 400px;
      height: 100vh;
      background: var(--background);
      box-shadow: -4px 0 24px var(--shadow-lg);
      display: flex;
      flex-direction: column;
      z-index: 1001;
      transform: translateX(100%);
      transition: transform 0.3s ease;
    }

    .reaction-panel.open {
      transform: translateX(0);
    }

    /* Panel Header */
    .panel-header {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      color: var(--text-light);
      transition: color 0.2s;
    }

    .close-button:hover {
      color: var(--text);
    }

    /* Panel Body */
    .panel-body {
      flex: 1;
      overflow-y: auto;
      padding: 16px 20px;
    }

    /* Emoji Picker */
    .emoji-picker {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
    }

    .emoji-button {
      flex: 1;
      padding: 12px;
      background: var(--background);
      border: 2px solid var(--border);
      border-radius: 8px;
      cursor: pointer;
      font-size: 24px;
      transition: all 0.2s;
      position: relative;
    }

    .emoji-button:hover {
      border-color: var(--primary-color);
      transform: scale(1.05);
    }

    .emoji-button.active {
      border-color: var(--primary-color);
      background: rgba(99, 102, 241, 0.1);
    }

    .emoji-count {
      position: absolute;
      bottom: 4px;
      right: 4px;
      font-size: 10px;
      font-weight: 600;
      color: var(--text-light);
    }

    /* Comment Input */
    .comment-input {
      margin-bottom: 20px;
    }

    .comment-textarea {
      width: 100%;
      min-height: 80px;
      padding: 12px;
      border: 2px solid var(--border);
      border-radius: 8px;
      resize: vertical;
      font-family: inherit;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .comment-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }

    .comment-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .char-counter {
      font-size: 12px;
      color: var(--text-light);
    }

    .submit-button {
      padding: 8px 16px;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
    }

    .submit-button:hover {
      background: var(--primary-hover);
    }

    .submit-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Comment List */
    .comment-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .comment-item {
      padding: 12px;
      background: var(--background);
      border: 1px solid var(--border);
      border-radius: 8px;
    }

    .comment-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
    }

    .comment-username {
      font-weight: 600;
      font-size: 14px;
    }

    .comment-time {
      font-size: 12px;
      color: var(--text-light);
      margin-left: auto;
    }

    .comment-emoji {
      font-size: 20px;
      margin-bottom: 4px;
    }

    .comment-text {
      font-size: 14px;
      color: var(--text);
      line-height: 1.5;
    }

    /* Loading */
    .loading {
      text-align: center;
      padding: 20px;
      color: var(--text-light);
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 40px 20px;
      color: var(--text-light);
    }

    /* Animations */
    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-track {
      background: transparent;
    }

    ::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: var(--text-light);
    }
  `;
}
console.log("EmojiFeed content script loaded on:", window.location.href);
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
let overlayApp = null;
let currentPageData = null;
async function init() {
  try {
    currentPageData = await getCurrentPageData();
    console.log("EmojiFeed initializing for page:", currentPageData);
    const pageResponse = await sendMessage("PAGE_CREATE_OR_GET", {
      url: currentPageData.url,
      title: currentPageData.title
    });
    if (!pageResponse.success) {
      console.error("Failed to create/get page:", pageResponse.error);
      return;
    }
    currentPageData.pageId = pageResponse.data.$id;
    overlayApp = await injectOverlay(currentPageData);
    console.log("EmojiFeed overlay injected successfully");
  } catch (error) {
    console.error("EmojiFeed initialization failed:", error);
  }
}
async function getCurrentPageData() {
  const url = window.location.href;
  const normalizedUrl = normalizeUrl(url);
  const urlHash = await hashUrl(normalizedUrl);
  const title = document.title || "Untitled Page";
  return {
    url: normalizedUrl,
    urlHash,
    title,
    pageId: null
    // Will be set after creating/getting page
  };
}
async function sendMessage(type, data) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, data }, (response) => {
      resolve(response);
    });
  });
}
let lastUrl = window.location.href;
const urlObserver = new MutationObserver(() => {
  if (window.location.href !== lastUrl) {
    lastUrl = window.location.href;
    console.log("URL changed to:", lastUrl);
    if (overlayApp) {
      overlayApp.unmount();
    }
    init();
  }
});
urlObserver.observe(document.body, {
  childList: true,
  subtree: true
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Content script received message:", message);
  if (message.type === "REALTIME_EVENT") {
    if (overlayApp && overlayApp.handleRealtimeEvent) {
      overlayApp.handleRealtimeEvent(message.data);
    }
  }
  sendResponse({ received: true });
  return true;
});
window.__emojifeed = {
  currentPageData,
  overlayApp,
  sendMessage
};
