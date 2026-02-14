import { createHotContext as __vite__createHotContext } from "/vendor/vite-client.js";import.meta.hot = __vite__createHotContext("/src/components/overlay/OverlayApp.vue.js");import { onMounted, onUnmounted } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"
import { useAuthStore } from "/src/store/auth.js.js"
import { useReactionsStore } from "/src/store/reactions.js.js"
import { useCommunitiesStore } from "/src/store/communities.js.js"
import { useUiStore } from "/src/store/ui.js.js"
import FloatingButton from "/src/components/overlay/FloatingButton.vue.js"
import ReactionPanel from "/src/components/overlay/ReactionPanel.vue.js"


const _sfc_main = {
  __name: 'OverlayApp',
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

// Initialize on mount
onMounted(async () => {
  console.log('OverlayApp mounted for page:', props.pageData)

  // Check authentication
  await authStore.checkSession()

  // Fetch communities
  await communitiesStore.fetchCommunities()

  // Fetch reactions for this page
  if (props.pageData.pageId) {
    await reactionsStore.fetchReactionsForPage(props.pageData.pageId)

    // Fetch user's reaction if authenticated
    if (authStore.isAuthenticated && authStore.user) {
      await reactionsStore.fetchUserReaction(props.pageData.pageId, authStore.user.id)
    }
  }
})

onUnmounted(() => {
  console.log('OverlayApp unmounted')
})

const __returned__ = { props, authStore, reactionsStore, communitiesStore, uiStore, onMounted, onUnmounted, get useAuthStore() { return useAuthStore }, get useReactionsStore() { return useReactionsStore }, get useCommunitiesStore() { return useCommunitiesStore }, get useUiStore() { return useUiStore }, FloatingButton, ReactionPanel }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}
import { createVNode as _createVNode, openBlock as _openBlock, createBlock as _createBlock, createCommentVNode as _createCommentVNode, createElementBlock as _createElementBlock } from "/vendor/.vite-deps-vue.js__v--bbf8ba7d.js"

const _hoisted_1 = { id: "emojifeed-overlay" }

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createVNode($setup["FloatingButton"], {
      count: $setup.reactionsStore.totalReactions,
      onClick: $setup.uiStore.togglePanel
    }, null, 8 /* PROPS */, ["count", "onClick"]),
    ($setup.uiStore.isPanelOpen)
      ? (_openBlock(), _createBlock($setup["ReactionPanel"], {
          key: 0,
          "page-data": $props.pageData
        }, null, 8 /* PROPS */, ["page-data"]))
      : _createCommentVNode("v-if", true)
  ]))
}

import "/src/components/overlay/OverlayApp.vue__vue_type--style_index--0_scoped--0b852f4e_lang.css.js"

_sfc_main.__hmrId = "0b852f4e"
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
export default /*#__PURE__*/_export_sfc(_sfc_main, [['render',_sfc_render],['__scopeId',"data-v-0b852f4e"],['__file',"/workspaces/messages-plugin/src/components/overlay/OverlayApp.vue"]])