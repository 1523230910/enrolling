<script>
export default {
    naem: 'Add',

    data: () => ({
        add: {
            id: '',         //考生号
            name: '',       //姓名
            gender: true,       //性别
            score: '',      //成绩
            school: '',     //毕业学校
            contact: '',    //联系电话
            contacts: '',   //联系人
            tuition: false,     //免学费
            lodge: false,       //内宿
            league: false,      //团员
            idCard: '',     //身份证
            locus: '',          //所在地
            volunteerOne: '',   //志愿一
            volunteerTwo: '',   //志愿二
            volunteerThree: '', //志愿三
            volunteerFour: '',  //志愿四
            regulate: true,     //调剂
            five: false,        //三加二
            nature: '非农业',     //户口性质
            parents: '',    //家长姓名
            remarks: '',    //备注
        },
        natures: ['非农业','农业','低保'],
        rules: {
            id: [{required: true,type: 'number',message: '准考证至少x位',}],
            name: [{required: true,message: '姓名不能为空'}],
            gender: [{required: true,type: 'boolean'}],
            score: [{required: true,type: 'number',message: '请输入成绩'}],
            school: [{required: true,message: '请输入学校'}],
            contact: [{required: true,type: 'enum',message: '请输入联系电话'}],
            contacts: [{required: true,message: '请输入联系人'}],
            tuition: [{required: true,type: 'boolean'}],
            lodge: [{required: true,type: 'boolean'}],
            league: [{required: true,type: 'boolean'}],
            idCard: [{required: true,min: 18, max: 18,message: '身份证号码是十八位'}],
            locus: [{required: true,message: '请填写正确的身份证号'}],
            lunteevorOne: [{required: true,type: 'number',message: '请选择第一志愿'}],
            volunteerTwo: [{required: true,type: 'number',message: '请选择第二志愿'}],
            volunteerThree: [{type: 'number',message: 'P'}],
            volunteerFour: [{type: 'number',message: 'P'}],
            regulate: [{required: true,type: 'boolean'}],
            five: [{required: true,type: 'boolean'}],
            nature: [{required: true}],
            parents: [{required: true,message: '请输入家长姓名'}],
        },
    }),

    created() {

    },

    methods: {
        Add(){

        }
    }
}
</script>

<template>
    <el-form :model="add" :rules="rules" ref="form" :hide-required-asterisk="true" label-position="top" :inline="true">
        <el-form-item prop="id" label="考生号">
            <el-input v-model="add.id" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="name" label="姓名">
            <el-input v-model="add.name"></el-input>
        </el-form-item>
        <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="add.gender">
            <el-radio :label="true">男</el-radio>
            <el-radio :label="false">女</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="score" label="成绩">
            <el-input v-model="add.score" type="number"></el-input>
        </el-form-item>
        <el-form-item prop="school" label="学校">
            <el-input v-model="add.school"></el-input>
        </el-form-item>
        <el-form-item prop="contact" label="联系电话">
            <el-input v-model="add.contact" type="tel"></el-input>
        </el-form-item>
        <el-form-item prop="contacts" label="联系人">
            <el-input v-model="add.contacts"></el-input>
        </el-form-item>
        <el-form-item prop="tuition" label="是否免学费">
            <el-radio-group v-model="add.tuition">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="lodge" label="是否内宿">
            <el-radio-group v-model="add.lodge">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="league" label="是否团员">
            <el-radio-group v-model="add.league">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="idCard" label="身份证号码">
            <el-input v-model="add.idCard" min="18" max="18"></el-input>
        </el-form-item>
        <el-form-item prop="locus" label="所在地">
            <el-input v-model="add.locus"></el-input>
        </el-form-item>
        <el-form-item prop="regulate" label="调剂">
            <el-radio-group v-model="add.regulate">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="five" label="三二分段">
            <el-radio-group v-model="add.five">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="nature" label="户口性质">
            <el-radio-group v-model="add.nature">
                <el-radio v-for="(nature,index) of natures" :key="index" :label="nature">{{ nature }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item prop="parents" label="家长姓名">
            <el-input v-model="add.parents"></el-input>
        </el-form-item>
        <el-form-item prop="remarks" label="备注">
            <el-input v-model="add.remarks" type="textarea"></el-input>
        </el-form-item>
        <el-button type="primary" @click="Add">录入</el-button>
    </el-form>
</template>

<style scoped>
</style>
