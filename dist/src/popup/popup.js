import { _ as _export_sfc, j as useAuthStore, k as useCommunitiesStore, p as onMounted, o as openBlock, a as createElementBlock, b as createBaseVNode, t as toDisplayString, u as unref, F as Fragment, f as renderList, y as normalizeStyle, c as computed, n as normalizeClass, r as ref, w as withDirectives, l as vModelSelect, z as vModelCheckbox, A as createTextVNode, v as vModelText, e as createCommentVNode, i as createBlock, s as createPinia, x as createApp } from "../../assets/_plugin-vue_export-helper-D5iCt8v-.js";
const _hoisted_1$3 = { class: "user-profile" };
const _hoisted_2$3 = { class: "profile-header" };
const _hoisted_3$3 = { class: "avatar-large" };
const _hoisted_4$3 = { class: "username" };
const _hoisted_5$3 = { class: "email" };
const _hoisted_6$2 = { class: "stats" };
const _hoisted_7$2 = { class: "stat" };
const _hoisted_8$2 = { class: "stat-value" };
const _hoisted_9$2 = { class: "communities-section" };
const _hoisted_10$1 = {
  key: 0,
  class: "empty"
};
const _hoisted_11$1 = {
  key: 1,
  class: "community-list"
};
const _hoisted_12 = { class: "community-icon" };
const _hoisted_13 = { class: "community-name" };
const _sfc_main$3 = {
  __name: "UserProfile",
  setup(__props) {
    const authStore = useAuthStore();
    const communitiesStore = useCommunitiesStore();
    const userInitial = computed(() => {
      var _a, _b;
      const username = ((_a = authStore.user) == null ? void 0 : _a.username) || ((_b = authStore.user) == null ? void 0 : _b.email) || "U";
      return username.charAt(0).toUpperCase();
    });
    onMounted(async () => {
      await communitiesStore.fetchCommunities();
    });
    async function handleLogout() {
      await authStore.logout();
    }
    return (_ctx, _cache) => {
      var _a, _b, _c, _d;
      return openBlock(), createElementBlock("div", _hoisted_1$3, [
        createBaseVNode("div", _hoisted_2$3, [
          createBaseVNode("div", _hoisted_3$3, toDisplayString(userInitial.value), 1),
          createBaseVNode("h2", _hoisted_4$3, toDisplayString(((_a = unref(authStore).user) == null ? void 0 : _a.username) || "User"), 1),
          createBaseVNode("p", _hoisted_5$3, toDisplayString((_b = unref(authStore).user) == null ? void 0 : _b.email), 1)
        ]),
        createBaseVNode("div", _hoisted_6$2, [
          _cache[1] || (_cache[1] = createBaseVNode("div", { class: "stat" }, [
            createBaseVNode("div", { class: "stat-value" }, "0"),
            createBaseVNode("div", { class: "stat-label" }, "Reactions")
          ], -1)),
          createBaseVNode("div", _hoisted_7$2, [
            createBaseVNode("div", _hoisted_8$2, toDisplayString(((_d = (_c = unref(authStore).user) == null ? void 0 : _c.communities) == null ? void 0 : _d.length) || 0), 1),
            _cache[0] || (_cache[0] = createBaseVNode("div", { class: "stat-label" }, "Communities", -1))
          ])
        ]),
        createBaseVNode("div", _hoisted_9$2, [
          _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Your Communities", -1)),
          unref(communitiesStore).allCommunities.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_10$1, [..._cache[2] || (_cache[2] = [
            createBaseVNode("p", null, "No communities yet", -1)
          ])])) : (openBlock(), createElementBlock("div", _hoisted_11$1, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(communitiesStore).allCommunities, (community) => {
              return openBlock(), createElementBlock("div", {
                key: community.$id,
                class: "community-badge",
                style: normalizeStyle({ borderColor: community.color })
              }, [
                createBaseVNode("span", _hoisted_12, toDisplayString(community.icon), 1),
                createBaseVNode("span", _hoisted_13, toDisplayString(community.name), 1)
              ], 4);
            }), 128))
          ]))
        ]),
        createBaseVNode("button", {
          class: "button secondary",
          onClick: handleLogout
        }, " Logout ")
      ]);
    };
  }
};
const UserProfile = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-3bc0fdea"]]);
const _hoisted_1$2 = { class: "trending-pages" };
const _hoisted_2$2 = { class: "period-selector" };
const _hoisted_3$2 = ["onClick"];
const _hoisted_4$2 = {
  key: 0,
  class: "loading"
};
const _hoisted_5$2 = {
  key: 1,
  class: "empty"
};
const _hoisted_6$1 = {
  key: 2,
  class: "page-list"
};
const _hoisted_7$1 = ["onClick"];
const _hoisted_8$1 = { class: "page-title" };
const _hoisted_9$1 = { class: "page-domain" };
const _hoisted_10 = { class: "page-stats" };
const _hoisted_11 = { class: "reaction-count" };
const _sfc_main$2 = {
  __name: "TrendingPages",
  setup(__props) {
    const periodOptions = [
      { value: "24h", label: "24h" },
      { value: "7d", label: "7d" },
      { value: "30d", label: "30d" }
    ];
    const selectedPeriod = ref("24h");
    const trendingPages = ref([]);
    const isLoading = ref(false);
    onMounted(async () => {
      await fetchTrendingPages();
    });
    async function selectPeriod(period) {
      selectedPeriod.value = period;
      await fetchTrendingPages();
    }
    async function fetchTrendingPages() {
      isLoading.value = true;
      try {
        const response = await sendMessage("PAGE_GET_TRENDING", {
          period: selectedPeriod.value,
          limit: 20
        });
        if (response.success) {
          trendingPages.value = response.data;
        }
      } catch (error) {
        console.error("Failed to fetch trending pages:", error);
      } finally {
        isLoading.value = false;
      }
    }
    function openPage(url) {
      chrome.tabs.create({ url });
    }
    function sendMessage(type, data = {}) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage({ type, data }, (response) => {
          resolve(response);
        });
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$2, [
        createBaseVNode("div", _hoisted_2$2, [
          (openBlock(), createElementBlock(Fragment, null, renderList(periodOptions, (option) => {
            return createBaseVNode("button", {
              key: option.value,
              class: normalizeClass(["period-button", { active: selectedPeriod.value === option.value }]),
              onClick: ($event) => selectPeriod(option.value)
            }, toDisplayString(option.label), 11, _hoisted_3$2);
          }), 64))
        ]),
        isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_4$2, [..._cache[0] || (_cache[0] = [
          createBaseVNode("p", null, "Loading trending pages...", -1)
        ])])) : trendingPages.value.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_5$2, [..._cache[1] || (_cache[1] = [
          createBaseVNode("p", null, "No trending pages yet", -1)
        ])])) : (openBlock(), createElementBlock("div", _hoisted_6$1, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(trendingPages.value, (page) => {
            return openBlock(), createElementBlock("div", {
              key: page.$id,
              class: "page-card",
              onClick: ($event) => openPage(page.normalizedUrl)
            }, [
              createBaseVNode("h3", _hoisted_8$1, toDisplayString(page.pageTitle), 1),
              createBaseVNode("p", _hoisted_9$1, toDisplayString(page.domain), 1),
              createBaseVNode("div", _hoisted_10, [
                createBaseVNode("span", _hoisted_11, " 🎭 " + toDisplayString(page.totalReactions), 1)
              ])
            ], 8, _hoisted_7$1);
          }), 128))
        ]))
      ]);
    };
  }
};
const TrendingPages = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-82bac05f"]]);
const _hoisted_1$1 = { class: "settings" };
const _hoisted_2$1 = { class: "setting-section" };
const _hoisted_3$1 = ["value"];
const _hoisted_4$1 = { class: "setting-section" };
const _hoisted_5$1 = { class: "checkbox-label" };
const _sfc_main$1 = {
  __name: "Settings",
  setup(__props) {
    const communitiesStore = useCommunitiesStore();
    const defaultCommunity = ref(null);
    const notificationsEnabled = ref(true);
    onMounted(async () => {
      await communitiesStore.fetchCommunities();
      const settings = await getSettings();
      if (settings) {
        defaultCommunity.value = settings.defaultCommunity;
        notificationsEnabled.value = settings.notificationsEnabled ?? true;
      }
    });
    async function getSettings() {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage(
          { type: "STORAGE_GET", data: { key: "emojifeed_settings" } },
          (response) => {
            resolve(response.success ? response.data : null);
          }
        );
      });
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$1, [
        createBaseVNode("div", _hoisted_2$1, [
          _cache[3] || (_cache[3] = createBaseVNode("h3", null, "Default Community", -1)),
          withDirectives(createBaseVNode("select", {
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => defaultCommunity.value = $event),
            class: "select"
          }, [
            _cache[2] || (_cache[2] = createBaseVNode("option", { value: null }, "None", -1)),
            (openBlock(true), createElementBlock(Fragment, null, renderList(unref(communitiesStore).allCommunities, (community) => {
              return openBlock(), createElementBlock("option", {
                key: community.$id,
                value: community.$id
              }, toDisplayString(community.icon) + " " + toDisplayString(community.name), 9, _hoisted_3$1);
            }), 128))
          ], 512), [
            [vModelSelect, defaultCommunity.value]
          ])
        ]),
        createBaseVNode("div", _hoisted_4$1, [
          _cache[5] || (_cache[5] = createBaseVNode("h3", null, "Notifications", -1)),
          createBaseVNode("label", _hoisted_5$1, [
            withDirectives(createBaseVNode("input", {
              type: "checkbox",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => notificationsEnabled.value = $event)
            }, null, 512), [
              [vModelCheckbox, notificationsEnabled.value]
            ]),
            _cache[4] || (_cache[4] = createBaseVNode("span", null, "Enable notifications", -1))
          ])
        ]),
        _cache[6] || (_cache[6] = createBaseVNode("div", { class: "setting-section" }, [
          createBaseVNode("h3", null, "About"),
          createBaseVNode("p", { class: "about-text" }, [
            createTextVNode(" EmojiFeed v1.0.0"),
            createBaseVNode("br"),
            createTextVNode(" Share emoji reactions on any webpage with communities. ")
          ]),
          createBaseVNode("a", {
            href: "https://github.com/your-repo/emojifeed",
            target: "_blank",
            class: "link"
          }, " View on GitHub ")
        ], -1))
      ]);
    };
  }
};
const Settings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-d4f33981"]]);
const _hoisted_1 = { class: "popup-container" };
const _hoisted_2 = {
  key: 0,
  class: "auth-container"
};
const _hoisted_3 = { class: "auth-form" };
const _hoisted_4 = ["disabled"];
const _hoisted_5 = {
  key: 1,
  class: "error"
};
const _hoisted_6 = { class: "switch-mode" };
const _hoisted_7 = {
  key: 1,
  class: "main-content"
};
const _hoisted_8 = { class: "tabs" };
const _hoisted_9 = { class: "tab-content" };
const _sfc_main = {
  __name: "Popup",
  setup(__props) {
    const authStore = useAuthStore();
    const activeTab = ref("profile");
    const isLoginMode = ref(true);
    const email = ref("");
    const password = ref("");
    const username = ref("");
    onMounted(async () => {
      await authStore.checkSession();
    });
    async function handleAuth() {
      try {
        if (isLoginMode.value) {
          await authStore.login(email.value, password.value);
        } else {
          await authStore.register(email.value, password.value, username.value);
        }
        email.value = "";
        password.value = "";
        username.value = "";
      } catch (error) {
        console.error("Auth failed:", error);
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        _cache[7] || (_cache[7] = createBaseVNode("header", { class: "popup-header" }, [
          createBaseVNode("div", { class: "logo" }, [
            createBaseVNode("span", { class: "logo-icon" }, "🎭"),
            createBaseVNode("h1", { class: "logo-text" }, "EmojiFeed")
          ])
        ], -1)),
        !unref(authStore).isAuthenticated ? (openBlock(), createElementBlock("div", _hoisted_2, [
          createBaseVNode("div", _hoisted_3, [
            createBaseVNode("h2", null, toDisplayString(isLoginMode.value ? "Sign In" : "Sign Up"), 1),
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => email.value = $event),
              type: "email",
              placeholder: "Email",
              class: "input"
            }, null, 512), [
              [vModelText, email.value]
            ]),
            withDirectives(createBaseVNode("input", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => password.value = $event),
              type: "password",
              placeholder: "Password",
              class: "input"
            }, null, 512), [
              [vModelText, password.value]
            ]),
            !isLoginMode.value ? withDirectives((openBlock(), createElementBlock("input", {
              key: 0,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => username.value = $event),
              type: "text",
              placeholder: "Username",
              class: "input"
            }, null, 512)), [
              [vModelText, username.value]
            ]) : createCommentVNode("", true),
            createBaseVNode("button", {
              class: "button primary",
              disabled: unref(authStore).isLoading,
              onClick: handleAuth
            }, toDisplayString(unref(authStore).isLoading ? "Loading..." : isLoginMode.value ? "Sign In" : "Sign Up"), 9, _hoisted_4),
            unref(authStore).error ? (openBlock(), createElementBlock("p", _hoisted_5, toDisplayString(unref(authStore).error), 1)) : createCommentVNode("", true),
            createBaseVNode("p", _hoisted_6, [
              createTextVNode(toDisplayString(isLoginMode.value ? "Don't have an account?" : "Already have an account?") + " ", 1),
              createBaseVNode("a", {
                onClick: _cache[3] || (_cache[3] = ($event) => isLoginMode.value = !isLoginMode.value)
              }, toDisplayString(isLoginMode.value ? "Sign Up" : "Sign In"), 1)
            ])
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_7, [
          createBaseVNode("nav", _hoisted_8, [
            createBaseVNode("button", {
              class: normalizeClass(["tab", { active: activeTab.value === "profile" }]),
              onClick: _cache[4] || (_cache[4] = ($event) => activeTab.value = "profile")
            }, " Profile ", 2),
            createBaseVNode("button", {
              class: normalizeClass(["tab", { active: activeTab.value === "trending" }]),
              onClick: _cache[5] || (_cache[5] = ($event) => activeTab.value = "trending")
            }, " Trending ", 2),
            createBaseVNode("button", {
              class: normalizeClass(["tab", { active: activeTab.value === "settings" }]),
              onClick: _cache[6] || (_cache[6] = ($event) => activeTab.value = "settings")
            }, " Settings ", 2)
          ]),
          createBaseVNode("div", _hoisted_9, [
            activeTab.value === "profile" ? (openBlock(), createBlock(UserProfile, { key: 0 })) : activeTab.value === "trending" ? (openBlock(), createBlock(TrendingPages, { key: 1 })) : activeTab.value === "settings" ? (openBlock(), createBlock(Settings, { key: 2 })) : createCommentVNode("", true)
          ])
        ]))
      ]);
    };
  }
};
const Popup = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-fb817ebd"]]);
console.log("EmojiFeed popup loading...");
const pinia = createPinia();
const app = createApp(Popup);
app.use(pinia);
app.mount("#app");
console.log("EmojiFeed popup loaded");
