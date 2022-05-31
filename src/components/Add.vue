<script>
import axios from "axios"
export default {
    naem: 'Add',
    data: () => ({
        token: localStorage.getItem('login_token'),
        majors: JSON.parse(localStorage.getItem('major')),
        addLoad: false,
        five: false,
        add: {
            id: '',         //考生号
            name: '',       //姓名
            gender: true,       //性别
            score: '',      //成绩
            school: '',     //毕业学校
            contact: '',    //本人联系电话
            contactOne: '',    //联系电话一
            contactTWo: '',    //联系电话二
            contacts: '',   //联系人
            tuition: false,     //免学费
            lodge: false,       //内宿
            league: false,      //团员
            idCard: '',     //身份证
            locus: '',          //所在地
            volunteerOne: [],   //志愿一
            volunteerTwo: [],   //志愿二
            volunteerThree: [], //志愿三
            volunteerFour: [],  //志愿四
            regulate: true,     //调剂
            five: false,        //三加二
            nature: '非农业',     //户口性质
            parents: '',    //家长姓名
            remarks: '',    //备注
        },
        natures: ['非农业', '农业', '低保'],
        rules: {
            id: [{ required: true, message: '请输入十四位考生号', pattern: /^\d{14}$/ }],
            name: [{ required: true, message: '姓名不能为空' }, { message: '请输入正确的姓名', pattern: /^[\u4E00-\u9FA5]+$/ }],
            gender: [{ required: true, type: 'boolean' }],
            score: [{ required: true, message: '请输入成绩', pattern: /.\d/ }],
            school: [{ required: true, message: '请输入学校', pattern: /^[\u4E00-\u9FA5]+$/ }],
            contact: [{ required: true, message: '请输入手机号码', pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/ }],
            contactOne: [{ required: true, message: '请输入手机号码', pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/ }],
            contacts: [{ required: true, message: '请输入联系人' }, { message: '请输入正确的姓名', pattern: /^[\u4E00-\u9FA5]+$/ }],
            tuition: [{ required: true, type: 'boolean' }],
            lodge: [{ required: true, type: 'boolean' }],
            league: [{ required: true, type: 'boolean' }],
            idCard: [{ required: true, message: '请输入十八位身份证号码', pattern: /^\d{17}[x|X|0-9]$/ }],
            volunteerOne: [{ required: true, message: '请选择第一志愿' }],
            volunteerTwo: [{ required: true, message: '请选择第二志愿' }],
            regulate: [{ required: true, type: 'boolean' }],
            five: [{ required: true, type: 'boolean' }],
            nature: [{ required: true }],
            parents: [{ required: true, message: '请输入家长姓名' }, { message: '请输入正确的姓名', pattern: /^[\u4E00-\u9FA5]+$/ }],
        },
        props: {
            value: 'id',
            label: 'name',
            children: 'major'
        },
    }),

    created() {
        if (!localStorage.getItem("login_token")) return false

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
        Add() {
            if (this.addLoad) return false
            this.$refs.form.validate((valid) => {
                if (valid) {
                    axios({
                        url: "//enroll.immers.icu/api/add",
                        method: "post",
                        headers: {
                            token: this.token,
                        },
                        data: this.add
                    }).then(res => {
                        if (res.data.status_code == 200) {
                            ElNotification({
                                title: '录入成功',
                                message: `${this.add.name}： ${this.add.id}`,
                                position: 'bottom-left',
                            })
                            this.$router.replace({
                                path: "/lists/empty",
                                query: { url: this.$route.path },
                            })
                        } else {
                            ElMessage({
                                message: "录入失败 请重试",
                                type: "warning",
                            })
                        }
                    })
                }
            })
        },

        Reset(){
            this.$refs.form.resetFields()
        },

        async IdInfo(val) {
            if (val.length >= 17){
                val.substr(16, 1) % 2 ? this.add.gender = true : this.add.gender = false
            }
            if (val.length >= 6 && !this.add.locus) {
                this.add.locus = true
                const locus = await axios({
                    url: "//enroll.immers.icu/api/locus",
                    method: "post",
                    data: {
                        id: val.substring(0, 6)
                    },
                    headers: {
                        token: this.token,
                    },
                })
                if (locus.data.data.id) {
                    this.add.locus = locus.data.data.name
                    this.addLoad = false
                } else {
                    ElMessage({
                        message: "身份证未匹配到归属地 请更改或联系管理员",
                        type: "warning",
                        duration: 3000,
                        grouping: true
                    })
                    this.add.locus = false
                    this.addLoad = true
                }
            }
        },

        VolunteerOne(val) {
            let one = this.majors.findIndex(res => res.id == this.add.volunteerOne[0])
            let two = this.majors[one].major.findIndex(res => res.id == this.add.volunteerOne[1])
            if (this.majors[one].major[two].five) {
                this.five = false
            } else {
                this.add.five = false
                this.five = true
            }
        }
    }
}
</script>

<template>
    <el-form :model="add" :rules="rules" ref="form" label-position="top" :hide-required-asterisk="true" :inline="true">
        <el-form-item prop="nature" label="户口性质" size="large">
            <el-radio-group v-model="add.nature">
                <el-radio-button v-for="(nature, index) of natures" :key="index" :label="nature">{{ nature }}
                </el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="tuition" label="是否免学费" size="large">
            <el-radio-group v-model="add.tuition">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="lodge" label="是否内宿" size="large">
            <el-radio-group v-model="add.lodge">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="league" label="共青团员">
            <el-radio-group v-model="add.league" size="large">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="regulate" label="接受调剂" size="large">
            <el-radio-group v-model="add.regulate">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="five" label="三二分段" size="large">
            <el-radio-group v-model="add.five" :disabled="five">
                <el-radio-button :label="true">是</el-radio-button>
                <el-radio-button :label="false">否</el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="操作" size="large">
            <el-button type="warning" @click="Reset" size="large">清除</el-button>
            <el-button type="success" @click="Add" :disabled="addLoad" size="large">录入</el-button>
        </el-form-item>
        <el-form-item prop="id" label="考生号" size="large">
            <el-input v-model="add.id" placeholder="统一十四位考生号"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名" size="large">
            <el-input v-model="add.name" placeholder="本人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="idCard" label="身份证号码" size="large">
            <el-input v-model="add.idCard" min="18" max="18" @input="IdInfo" placeholder="十八位身份证号码"></el-input>
        </el-form-item>
        <el-form-item prop="score" label="成绩" size="large">
            <el-input v-model="add.score" placeholder="总分成绩"></el-input>
        </el-form-item>
        <el-form-item prop="school" label="学校" size="large">
            <el-input v-model="add.school" placeholder="初中学校名称"></el-input>
        </el-form-item>
        <el-form-item prop="contact" label="本人联系电话" size="large">
            <el-input v-model="add.contact" type="tel" placeholder="输入手机号码"></el-input>
        </el-form-item>
        <el-form-item prop="contacts" label="联系人" size="large">
            <el-input v-model="add.contacts" placeholder="联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="contactOne" label="联系电话一" size="large">
            <el-input v-model="add.contactOne" type="tel" placeholder="输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="联系电话二" size="large">
            <el-input v-model="add.contactTwo" type="tel" placeholder="可输入固话或手机号"></el-input>
        </el-form-item>
        <el-form-item prop="parents" label="家长姓名" size="large">
            <el-input v-model="add.parents" placeholder="监护人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="volunteerOne" label="第一志愿" label-width="10px" size="large">
            <el-cascader v-model="add.volunteerOne" :options="majors" :props="props" placeholder="选择第一志愿"
                @change="VolunteerOne" />
        </el-form-item>
        <el-form-item prop="volunteerTwo" label="第二志愿" size="large">
            <el-cascader v-model="add.volunteerTwo" :options="majors" :props="props" placeholder="选择第二志愿" />
        </el-form-item>
        <el-form-item label="第三志愿" size="large">
            <el-cascader v-model="add.volunteerThree" :options="majors" :props="props" placeholder="选择第三志愿" clearable />
        </el-form-item>
        <el-form-item label="第四志愿" size="large">
            <el-cascader v-model="add.volunteerFour" :options="majors" :props="props" placeholder="选择第四志愿" clearable />
        </el-form-item>
        <el-form-item prop="remarks" label="备注" style="width: 100%;" size="large">
            <el-input v-model="add.remarks" type="textarea"></el-input>
        </el-form-item>
    </el-form>
</template>

<style scoped>
.el-form {
    background: #fff;
    padding: 2rem 0 0 2rem;
    border-radius: 1rem;
    align-items: flex-end;
}

.el-form :deep(.el-textarea__inner) {
    height: 6rem;
    resize: none;
}

.el-form--inline .el-form-item {
    margin-right: 20px;
}

.el-button--large {
    --el-button-size: 42px;
}
:deep(.el-cascader) {
    width: 260.5px;
}
</style>
