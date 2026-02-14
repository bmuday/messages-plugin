import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/ReactionPanel.vue.js");import { ref } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"
import { useAuthStore } from "/src/store/auth.js.js"
import { useReactionsStore } from "/src/store/reactions.js.js"
import { useCommunitiesStore } from "/src/store/communities.js.js"
import { useUiStore } from "/src/store/ui.js.js"
import EmojiPicker from "/src/components/overlay/EmojiPicker.vue.js"
import CommentInput from "/src/components/overlay/CommentInput.vue.js"
import CommentList from "/src/components/overlay/CommentList.vue.js"


const _sfc_main = {
  __name: 'ReactionPanel',
  props: {
  pageData: {
    type: Object,
    required: true
  }
},
  setup(__props, { expose: __expose }) {
  __expose();

const props = __props

// Stores
const authStore = useAuthStore()
const reactionsStore = useReactionsStore()
const communitiesStore = useCommunitiesStore()
const uiStore = useUiStore()

// State
const selectedCommunity = ref(null)
const showLoginModal = ref(false)

// Handlers
async function onEmojiSelect(emoji) {
  if (!authStore.isAuthenticated) {
    showLoginModal.value = true
    return
  }

  const communityId = selectedCommunity.value || communitiesStore.allCommunities[0]?.$id

  await reactionsStore.toggleEmoji(
    props.pageData.pageId,
    emoji,
    communityId,
    authStore.user.id
  )
}

async function onCommentSubmit(comment) {
  if (!authStore.isAuthenticated) {
    return
  }

  const communityId = selectedCommunity.value || communitiesStore.allCommunities[0]?.$id
  const emoji = reactionsStore.userReactionEmoji || '❤️'

  await reactionsStore.addReaction(
    props.pageData.pageId,
    emoji,
    comment,
    communityId,
    authStore.user.id
  )
}

function onCommunityChange() {
  // Refetch reactions for selected community
  reactionsStore.fetchReactionsForPage(props.pageData.pageId, {
    communityId: selectedCommunity.value
  })
}

const __returned__ = { props, authStore, reactionsStore, communitiesStore, uiStore, selectedCommunity, showLoginModal, onEmojiSelect, onCommentSubmit, onCommunityChange, ref, get useAuthStore() { return useAuthStore }, get useReactionsStore() { return useReactionsStore }, get useCommunitiesStore() { return useCommunitiesStore }, get useUiStore() { return useUiStore }, EmojiPicker, CommentInput, CommentList }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { createCommentVNode as _createCommentVNode, toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, renderList as _renderList, Fragment as _Fragment, openBlock as _openBlock, createElementBlock as _createElementBlock, vModelSelect as _vModelSelect, withDirectives as _withDirectives, createVNode as _createVNode, createBlock as _createBlock, normalizeClass as _normalizeClass } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = { class: "panel-header" }
const _hoisted_2 = { class: "panel-title" }
const _hoisted_3 = { class: "panel-body" }
const _hoisted_4 = {
  key: 0,
  class: "community-filter"
}
const _hoisted_5 = ["value"]
const _hoisted_6 = { class: "login-prompt" }

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", {
    class: _normalizeClass(["reaction-panel", { open: $setup.uiStore.isPanelOpen }])
  }, [
    _createCommentVNode(" Header "),
    _createElementVNode("div", _hoisted_1, [
      _createElementVNode("h2", _hoisted_2, _toDisplayString($props.pageData.title), 1 /* TEXT */),
      _createElementVNode("button", {
        class: "close-button",
        onClick: _cache[0] || (_cache[0] = (...args) => ($setup.uiStore.closePanel && $setup.uiStore.closePanel(...args))),
        title: "Close"
      }, [...(_cache[3] || (_cache[3] = [
        _createElementVNode("span", null, "✕", -1 /* CACHED */)
      ]))])
    ]),
    _createCommentVNode(" Body "),
    _createElementVNode("div", _hoisted_3, [
      _createCommentVNode(" Community Filter (placeholder for now) "),
      ($setup.communitiesStore.allCommunities.length > 0)
        ? (_openBlock(), _createElementBlock("div", _hoisted_4, [
            _withDirectives(_createElementVNode("select", {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => (($setup.selectedCommunity) = $event)),
              onChange: $setup.onCommunityChange
            }, [
              _cache[4] || (_cache[4] = _createElementVNode("option", { value: null }, "All Communities", -1 /* CACHED */)),
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList($setup.communitiesStore.allCommunities, (community) => {
                return (_openBlock(), _createElementBlock("option", {
                  key: community.$id,
                  value: community.$id
                }, _toDisplayString(community.icon) + " " + _toDisplayString(community.name), 9 /* TEXT, PROPS */, _hoisted_5))
              }), 128 /* KEYED_FRAGMENT */))
            ], 544 /* NEED_HYDRATION, NEED_PATCH */), [
              [_vModelSelect, $setup.selectedCommunity]
            ])
          ]))
        : _createCommentVNode("v-if", true),
      _createCommentVNode(" Emoji Picker "),
      _createVNode($setup["EmojiPicker"], {
        counts: $setup.reactionsStore.reactionCounts,
        "user-emoji": $setup.reactionsStore.userReactionEmoji,
        onSelect: $setup.onEmojiSelect
      }, null, 8 /* PROPS */, ["counts", "user-emoji"]),
      _createCommentVNode(" Comment Input (if authenticated) "),
      ($setup.authStore.isAuthenticated)
        ? (_openBlock(), _createBlock($setup["CommentInput"], {
            key: 1,
            onSubmit: $setup.onCommentSubmit
          }))
        : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
            _createCommentVNode(" Login Prompt (if not authenticated) "),
            _createElementVNode("div", _hoisted_6, [
              _cache[5] || (_cache[5] = _createElementVNode("p", null, "Sign in to add your reaction", -1 /* CACHED */)),
              _createElementVNode("button", {
                class: "submit-button",
                onClick: _cache[2] || (_cache[2] = $event => ($setup.showLoginModal = true))
              }, "Sign In")
            ])
          ], 2112 /* STABLE_FRAGMENT, DEV_ROOT_FRAGMENT */)),
      _createCommentVNode(" Comment List "),
      _createVNode($setup["CommentList"], {
        reactions: $setup.reactionsStore.currentPageReactions
      }, null, 8 /* PROPS */, ["reactions"])
    ])
  ], 2 /* CLASS */))
}

import "/src/components/overlay/ReactionPanel.vue__vue_type--style_index--0_scoped--07589b21_lang.css.js"

_sfc_main.__hmrId = "07589b21"
typeof __VUE_HMR_RUNTIME__ !== 'undefined' && __VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.on('file-changed', ({ file }) => {
  __VUE_HMR_RUNTIME__.CHANGED_FILE = file
})
import.meta.hot.accept(mod => {
  if (!mod) return
  const { default: updated, _rerender_only } = mod
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
  }
})
import _export_sfc from "/vendor/id-__x00__plugin-vue:export-helper.js"
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-07589b21"],['__file',"/workspaces/messages-plugin/src/components/overlay/ReactionPanel.vue"]])