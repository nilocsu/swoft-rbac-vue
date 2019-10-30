<script>

import store from '@/store/index'
export default {
  functional: true,
  props: {
    authority: Array
  },
  render (h, context) {
    const { props, scopedSlots } = context
    let permissions = store.state.d2admin.permission.permissions
    let show = false
    for (let v of props.authority) {
      if (permissions.includes(v)) {
        show = true
        break
      }
    }
    return show ? scopedSlots.default() : null
  }
}
</script>
