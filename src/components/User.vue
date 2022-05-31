<script>
import axios from "axios"
import { Refresh } from "@element-plus/icons-vue"

export default {
    name: "User",

    data: () => ({
        Refresh,
        token: localStorage.getItem("login_token"),
        lists: [],
        roles: JSON.parse(localStorage.getItem("roles")),
        state: [],
        tableLoad: true,
        logonLoad: localStorage.getItem("roles") ? false : true,
        logon: {
            name: "",
            state: true,
            authority: 1,
            password: "",
        },
        rules: {
            name: [
                {
                    required: true,
                    message: "请输入账号",
                },
            ],
            password: [
                {
                    min: 8,
                    required: true,
                    message: "密码至少为 8 个字符",
                },
            ],
        },
    }),

    async created() {
        if (!localStorage.getItem("login_token")) return false
        
        const roles = await axios({
            url: "//enroll.immers.icu/api/roles",
            method: "post",
            headers: {
                token: this.token,
            },
        })

        if (roles.data.status_code == 200) {
            this.roles = roles.data.data;
            localStorage.setItem("roles", JSON.stringify(roles.data.data));
            this.logonLoad = false;
        }

        const userLists = await axios({
            url: "//enroll.immers.icu/api/user-lists",
            method: "post",
            headers: {
                token: this.token,
            },
        })

        if (userLists.data.status_code == 200) {
            this.lists = userLists.data.data;
            this.tableLoad = false;
        }
    },

    methods: {
        Role(val, id) {
            axios({
                url: "//enroll.immers.icu/api/role",
                method: "post",
                headers: {
                    token: this.token,
                },
                data: {
                    id,
                    authority: val,
                },
            }).then((res) => {
                console.log(res);
            });
        },

        State(val, id) {
            axios({
                url: "//enroll.immers.icu/api/user-state",
                method: "post",
                headers: {
                    token: this.token,
                },
                data: {
                    id,
                    state: val,
                },
            }).then((res) => {
                console.log(res)
            })
        },

        async Pwd(id, name) {
            const prompt = await ElMessageBox.prompt(`请输入账户：${name}的新密码`, "修改密码", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                inputPattern: /.{8}/,
                inputErrorMessage: "密码至少为 8 个字符",
            }).then(({ value }) => value).catch(() => false)

            if (!prompt) {
                return false
            }

            axios({
                url: "//enroll.immers.icu/api/change-pwd",
                method: "post",
                data: {
                    id,
                    password: prompt,
                },
                headers: {
                    token: this.token,
                },
            }).then((res) => {
                if (res.data.data) {
                    ElMessage({
                        message: "修改成功",
                        type: "success",
                    })
                } else {
                    ElMessage({
                        message: "修改失败 请重试",
                        type: "warning",
                    })
                }
            })


        },

        async Del(id, name) {
            const confirm = await ElMessageBox.confirm(
                `点击确认删除账户：${name}`,
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
                url: "//enroll.immers.icu/api/delete-user",
                method: "post",
                data: {
                    id,
                },
                headers: {
                    token: this.token,
                },
            }).then(res => {
                if (res.data.data) {
                    this.$router.replace({
                        path: "/lists/empty",
                        query: { url: this.$route.path },
                    })
                } else {
                    ElMessage({
                        message: "删除失败 请重试",
                        type: "warning",
                    })
                }
            })

        },

        Logon() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if (this.logonLoad) return false;
                    this.logonLoad = true;
                    axios({
                        url: "http://enroll.immers.icu/api/register",
                        method: "post",
                        data: this.logon,
                        headers: {
                            token: this.token,
                        },
                    }).then((res) => {
                        if (res.data.status_code == 200) {
                            this.$router.replace({
                                path: "/lists/empty",
                                query: { url: this.$route.path },
                            })
                            return false;
                        }
                        ElMessage({
                            message: res.data.message[0],
                            type: "warning",
                        })
                    })
                }
            })
        },
    },
};
</script>

<template>
    <el-form :model="logon" :rules="rules" ref="form" :hide-required-asterisk="true" label-position="top">
        <el-form-item prop="name" label="账号">
            <el-input v-model="logon.name" placeholder="Name"></el-input>
        </el-form-item>
        <el-form-item prop="authority" label="角色">
            <el-select v-model="logon.authority">
                <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
            </el-select>
        </el-form-item>
        <el-form-item prop="state" label="状态">
            <el-switch v-model="logon.state" />
        </el-form-item>
        <el-form-item prop="password" label="密码">
            <el-input v-model="logon.password" type="password" placeholder="Password" @keyup.enter="Logon"></el-input>
        </el-form-item>
        <el-button type="primary" @click="Logon" :loading-icon="Refresh" :loading="logonLoad">注册
        </el-button>
    </el-form>
    <el-table :data="lists" v-loading="tableLoad" height="500px">
        <el-table-column label="账户" prop="name" />
        <el-table-column label="角色">
            <template #default="scope">
                <el-select v-model="scope.row.authority" @change="Role($event, scope.row.id)">
                    <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
                </el-select>
            </template>
        </el-table-column>
        <el-table-column label="状态">
            <template #default="scope">
                <el-switch v-model="scope.row.state" @change="State($event, scope.row.id)" />
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button @click="Pwd(scope.row.id, scope.row.name)" type="info">修改密码</el-button>
                <el-button @click="Del(scope.row.id, scope.row.name)" type="danger">删除账户</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>
.el-form {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    background: #fff;
    margin-bottom: var(--el-main-padding);
}

.el-form-item {
    margin: 0 12px;
}

.el-form .el-button {
    margin: 0px 12px 8px 12px;
}

.el-form :deep(.el-form-item__label) {
    line-height: 40px !important;
    height: 40px;
    margin-bottom: 0 !important;
    font-weight: bold;
}

.el-form :deep(.el-form-item__content) {
    line-height: 40px;
    padding: 8px 0 8px 0;
}
</style>
