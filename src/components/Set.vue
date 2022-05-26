<script>
import axios from 'axios'
export default {
    naem: 'Set',

    data: () => ({
        token: localStorage.getItem('login_token'),
        add: {
            majors: JSON.parse(localStorage.getItem('majors')),
            major: 1,
            name: '',
            five: false
        },
        addLoad: false,
        major: '',
        majorLoad: false,
        majors: JSON.parse(localStorage.getItem('major')),
        props: {
            value: 'id',
            label: 'name',
            children: 'major',
        },
    }),

    created() {
        axios({
            url: "//enroll.immers.icu/api/majors",
            method: "post",
            headers: {
                token: this.token,
            },
        }).then(res => {
            if (res.data.status_code == 200) {
                this.add.majors = res.data.data
                localStorage.setItem('majors', JSON.stringify(res.data.data))
            }
        })

        axios({
            url: "//enroll.immers.icu/api/major",
            method: "post",
            headers: {
                token: this.token,
            },
        }).then(res => {
            this.majors = res.data.data
            localStorage.setItem('major', JSON.stringify(res.data.data))
        })
    },

    methods: {
        async Del() {
            if (this.majorLoad) return false;
            this.majorLoad = true;
            if (!this.major) {
                ElMessage({
                    message: "请选择专业",
                    type: "warning",
                })
                this.majorLoad = false;
                return false
            }

            const confirm = await ElMessageBox.confirm(
                `确认删除此专业吗？`,
                "确认删除",
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "error",
                }
            ).then(() => true).catch(() => false)

            if (!confirm) {
                return false
            }

            axios({
                url: "//enroll.immers.icu/api/delete-major",
                method: "post",
                data: {
                    major: this.major[1],
                },
                headers: {
                    token: this.token,
                },
            }).then(res => {
                if (res.data.status_code == 200) {
                    ElMessage({
                        message: "删除成功",
                        type: "success",
                    })
                    this.$router.replace({
                        path: "/lists/empty",
                        query: { url: this.$route.path },
                    })
                } else {
                    ElMessage({
                        message: "删除失败 请重试",
                        type: "error",
                    })
                    this.majorLoad = false
                }
            })

        },

        Revise() {

        },

        Add() {
            if (this.addLoad) return false;
            this.addLoad = true;
            if (!this.add.name) {
                ElMessage({
                    message: "不能为空",
                    type: "warning",
                })
                this.addLoad = false;
                return false
            }
            axios({
                url: "//enroll.immers.icu/api/add-major",
                method: "post",
                data: {
                    majors: this.add.major,
                    name: this.add.name,
                    five: this.add.five
                },
                headers: {
                    token: this.token,
                },
            }).then(res => {
                if (res.data.status_code == 200) {
                    ElMessage({
                        message: "添加成功",
                        type: "success",
                    })
                    this.$router.replace({
                        path: "/lists/empty",
                        query: { url: this.$route.path },
                    })
                } else {
                    ElMessage({
                        message: "专业已存在",
                        type: "error",
                    })
                    this.addLoad = false
                }
            })
        }
    }
}
</script>

<template>
    <el-descriptions title="专业设置" direction="vertical" :column="5" border>
        <el-descriptions-item label="专业选择">
            <el-cascader v-model="major" :options="majors" :props="props" placeholder="选择对应专业" />
        </el-descriptions-item>
        <el-descriptions-item label="操作">
            <el-button @click="Del" type="danger" :disabled="majorLoad">删除</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="专业名称">
            <el-select v-model="add.major" placeholder="专业分类">
                <el-option v-for="res of add.majors" :key="res.id" :label="res.name" :value="res.id" />
            </el-select>
            <el-input v-model="add.name" placeholder="新专业名称" @keyup.enter="Add"></el-input>
        </el-descriptions-item>
        <el-descriptions-item label="三二分段">
            <el-radio-group v-model="add.five">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item label="操作">
            <el-button @click="Add" type="success" :disabled="addLoad">添加</el-button>
        </el-descriptions-item>
    </el-descriptions>
</template>

<style scoped>
.el-descriptions__cell .el-input {
    width: 13rem;
    margin-left: 1rem;
}
</style>
