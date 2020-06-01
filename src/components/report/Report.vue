<template>
  <div class="">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div id="main" style="width: 900px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "",
  data() {
    return {
      option: {
        title: {
          text: "用户来源",
        },
        tooltip: {},
        legend: {
          data: ["销量"],
        },
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    };
  },
  //   在页面渲染完后调用该函数
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    const { data: res } = await this.$http.get(`reports/type/1`);
    if (res.meta.status != 200) {
      return this.$message.error("获取统计数据失败");
    }
    console.log(res.data);

    // this.option = res.data;
    // 将返回的结果与原配置项进行合并
    const combineResult = Object.assign(this.option, res.data);

    // 使用指定的配置项和数据显示图表。
    myChart.setOption(combineResult);
  },
};
</script>

<style lang="" scoped></style>
