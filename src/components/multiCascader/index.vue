<template>
  <div class="c-multi-cascader">
    <ele-multi-cascader
      :options="options"
      :collapse-tags="true"
      :select-children="true"
      :output-level-value="false"
      :placeholder="placeholder"
      v-model="selected"
      size="medium"
      @change="onMultiCascaderChange"
      @clickItem="onMultiCascaderClickItem"
    ></ele-multi-cascader>
  </div>
</template>

<script>
import EleMultiCascader from './ele-multi-cascader/main.vue';


export default {
  name: 'MultiCascader',
  components: {
    EleMultiCascader,
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: '请选择商品类目',
    },
  },
  data() {
    return {
      selected: [],
    };
  },
  computed: {},
  watch: {
    value: {
      deep: true,
      handler() {
        if (this.value != this.selected) this.selected = this.value;
      }
    }
  },
  created() {
  },
  mounted() {
  },
  methods: {
    onMultiCascaderChange(value, item, arr) {
      this.$emit('on-change', value, item, arr);
    },
    onMultiCascaderClickItem(item) {
      this.$emit('on-click-Item', item);
    },
  },
};
</script>

<style lang="less" scoped>
.c-multi-cascader {
}
</style>
