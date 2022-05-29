<script>
import axios from "axios"
export default {
    naem: 'Find',

    data: () => ({
        token: localStorage.getItem('login_token'),
        majors: JSON.parse(localStorage.getItem('major')),
        enrolls: [],
        props: {
            value: 'id',
            label: 'name',
            children: 'major',
            disabled: false,
        },
    }),

    created() {
        if (!localStorage.getItem("login_token")) return false

        axios({
            url: "//enroll.immers.icu/api/find",
            method: "post",
            headers: {
                token: this.token,
            },
        }).then(res => {
            res.data.data.forEach(data => {
                data.volunteerOne = JSON.parse(data.volunteerOne)
                data.volunteerTwo = JSON.parse(data.volunteerTwo)
                data.volunteerThree = JSON.parse(data.volunteerThree)
                data.volunteerFour = JSON.parse(data.volunteerFour)
            })
            this.enrolls = res.data.data
        })
    },

    methods: {

    }
}
</script>

<template>
    <el-table :data="enrolls" style="width: 100%">
        <el-table-column prop="id" label="考生号" width="150" />
        <el-table-column prop="name" label="姓名" width="80" />
        <el-table-column prop="volunteerOne" label="第一志愿" width="250">
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerOne" :options="majors" placeholder="无第一志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column prop="volunteerTwo" label="第二志愿" width="250">
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerTwo" :options="majors" placeholder="无第二志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column prop="volunteerThree" label="第三志愿" width="250">
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerThree" :options="majors" placeholder="无第三志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column prop="volunteerFour" label="第四志愿" width="250">
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerFour" :options="majors" placeholder="无第四志愿" :props="props" />
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>
</style>
