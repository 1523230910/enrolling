<script>
import axios from 'axios'
export default {
    naem: 'Set',

    data: () => ({
        token: localStorage.getItem('login_token'),
        add: {
            majors: JSON.parse(localStorage.getItem('majors')),
            major: '',
            name: '',
            five: false
        },
        addLoad: false,
        major: '',
        majorDisabled: false,
        majorLoad: false,
        five: false,
        majors: JSON.parse(localStorage.getItem('major')),
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
            url: "//enroll.immers.icu/api/majors",
            method: "post",
            headers: {
                token: this.token,
            },
        }).then(res => {
            if (!this.add.majors || JSON.stringify(res.data.data) !== JSON.stringify(this.add.majors)) {
                this.add.majors = res.data.data
                localStorage.setItem('majors', JSON.stringify(res.data.data))
                ElMessage({
                    message: "数据更新",
                    type: "success",
                })
            }
        })

        axios({
            url: "//enroll.immers.icu/api/major",
            method: "post",
            headers: {
                token: this.token,
            },
        }).then(res => {
            if (!this.majors || JSON.stringify(res.data.data) !== JSON.stringify(this.majors)) {
                this.majors = res.data.data
                localStorage.setItem('major', JSON.stringify(res.data.data))
                ElMessage({
                    message: "数据更新",
                    type: "success",
                })
            }
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
                    major: this.major
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
                        message: res.data.message,
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
                }
                this.addLoad = false
            })
        },

        Major() {
            let one = this.majors.findIndex(res => res.id == this.major[0])
            let two = this.majors[one].major.findIndex(res => res.id == this.major[1])
            this.majorDisabled= this.majors[one].major[two].disabled
            this.five= this.majors[one].major[two].five
        },

        MajorDisabled(val) {
            if(!this.major[1]) return false
            axios({
                url: '//enroll.immers.icu/api/major-disabled',
                method: 'post',
                headers: {
                    token: this.token
                },
                data: {
                    id: this.major[1],
                    disabled: val
                }
            }).then(res => {
                if (res.data.status_code == 200) {
                    ElMessage({
                        message: "修改成功",
                        type: "success",
                    })
                } else {
                    ElMessage({
                        message: "修改失败 请重试",
                        type: "error",
                    })
                }
            })
        },

        MajorFive(val){
            if(!this.major[1]) return false
            axios({
                url: '//enroll.immers.icu/api/major-five',
                method: 'post',
                headers: {
                    token: this.token
                },
                data: {
                    id: this.major[1],
                    five: val
                }
            }).then(res => {
                if (res.data.status_code == 200) {
                    ElMessage({
                        message: "修改成功",
                        type: "success",
                    })
                } else {
                    ElMessage({
                        message: "修改失败 请重试",
                        type: "error",
                    })
                }
            })
        }
    }
}
</script>

<template>
    <el-descriptions title="专业设置" direction="vertical" :column="7" border>
        <el-descriptions-item label="专业选择">
            <el-cascader v-model="major" :options="majors" :props="props" placeholder="选择对应专业" @change="Major" />
        </el-descriptions-item>
        <el-descriptions-item label="三二分段">
            <el-radio-group v-model="five" @change="MajorFive">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-descriptions-item>
        <el-descriptions-item label="禁用">
            <el-switch v-model="majorDisabled" @change="MajorDisabled" />
        </el-descriptions-item>
        <el-descriptions-item label="操作">
            <el-button @click="Del" type="danger" :disabled="majorLoad">删除</el-button>
        </el-descriptions-item>
        <el-descriptions-item label="专业名称">
            <el-select v-model="add.major" placeholder="专业分类" allow-create filterable default-first-option>
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
:deep(.el-cascader) {
    width: 260px;
}
.el-select{
    width: 160px;
}
</style>
