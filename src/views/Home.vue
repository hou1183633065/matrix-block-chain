<template>
  <div class="home">
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {};
  },
  mounted() {
    console.log(this.httpProvider);
    // 异步获取网络协议版本
    this.httpProvider.version.getNetwork((error, result) => {
      console.log(error, result);
    });
    // 使用Keccak-256 SHA3算法哈希过的结果
    let hash = this.httpProvider.sha3("hello123");
    console.log(hash);
    // 解析hex格式
    let hashOfHash = this.httpProvider.sha3(hash, { encoding: "hex" });
    console.log(hashOfHash);
  }
};
</script>
