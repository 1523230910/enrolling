<script setup>
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue"
</script>

<script>
import axios from "axios"

export default {
    naem: 'Find',

    data: () => ({
        token: localStorage.getItem('login_token'),
        majors: JSON.parse(localStorage.getItem('major')),
        findLoad: false,
        enrolls: [],
        props: {
            value: 'id',
            label: 'name',
            children: 'major',
            disabled: false,
        },
        find: {
            skip: 0,
            take: 10,
            id: '',
            name: '',       //姓名//
            gender: '',       //性别//
            score: '',      //成绩//
            school: '',     //毕业学校//
            contact: '',    //本人联系电话//
            contactOne: '',    //联系电话一//
            contactTwo: '',    //联系电话二//
            contacts: '',   //联系人//
            tuition: '',     //免学费//
            lodge: '',       //内宿//
            league: '',      //团员//
            idCard: '',     //身份证//
            locus: '',          //所在地//
            volunteerOne: [],   //志愿一//
            volunteerTwo: [],   //志愿二//
            volunteerThree: [], //志愿三//
            volunteerFour: [],  //志愿四//
            regulate: '',     //调剂//
            five: '',        //三加二//
            nature: '',     //户口性质//
            parents: '',    //家长姓名//
            remarks: '',    //备注//
            location: '',    //备注//
            updated_at: '',
        },
        natures: ['非农业', '农业', '低保'],
        part: 1,
    }),

    created() {
        if (!localStorage.getItem("login_token")) return false
        this.Finds()

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
        Finds(data) {
            if (data != 'part') {
                this.part = 1
            }
            this.find.skip = this.find.take * (this.part - 1)
            this.enrolls = []
            this.findLoad = true
            axios({
                url: "//enroll.immers.icu/api/find",
                method: "post",
                headers: {
                    token: this.token,
                },
                data: this.find
            }).then(res => {
                res.data.data.forEach(data => {
                    data.disabled = this.MajorDisabled(data.volunteerOne[0], data.volunteerOne[1])
                })

                this.enrolls = res.data.data
                this.findLoad = false
            })
        },

        IdInfo(event) {
            if (event.idCard.length >= 17) {
                event.idCard.substr(16, 1) % 2 ? event.gender = true : event.gender = false
            }
        },

        Five(event) {
            let disabled = this.MajorDisabled(event.volunteerOne[0], event.volunteerOne[1])
            if (disabled) {
                event.five = !disabled
            }
            event.disabled = disabled
        },

        Find(data) {
            axios({
                url: "//enroll.immers.icu/api/update",
                method: "post",
                headers: {
                    token: this.token,
                },
                data
            }).then(res => {
                if(res.data.data){
                    ElMessage({
                        message: "修改成功",
                        type: "success",
                    })
                }else{
                    ElMessage({
                        message: '修改错误',
                        type: "error",
                    })
                }
            })
        },

        MajorDisabled(Vone, Vtwo) {
            let one = this.majors.find(one => one.id == Vone)
            let two = one.major.find(two => two.id == Vtwo)
            return !two.five
        },

        ChangFind(row) {
            console.log(row)
        },

        Del(id){
            axios({
                url: "//enroll.immers.icu/api/delete-enroll",
                method: "post",
                headers: {
                    token: this.token,
                },
                data: {
                    id
                }
            }).then(() => {
                this.Finds('part')
            })
        }



    }
}
</script>

<template>
    <el-table :data="enrolls" style="width: 100%" :highlight-current-row="true" v-loading="findLoad">
        <el-table-column prop="id" label="考生号" width="140" fixed>
            <template #header>
                <el-input placeholder="考生号" v-model="find.id" @change="Finds"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="110" fixed>
            <template #header>
                <el-input placeholder="姓名" v-model="find.name" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.name" @change="Find(scope.row)"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="190">
            <template #header>
                <el-input placeholder="身份证" v-model="find.idCard" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.idCard" @change="IdInfo(scope.row)"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="80">
            <template #header>
                <el-input placeholder="成绩" v-model="find.score" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.score"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="130">
            <template #header>
                <el-select v-model="find.five" placeholder="三二分段" @change="Finds" clearable>
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </template>
            <template #default="scope">
                <el-radio-group v-model="scope.row.five" :disabled="scope.row.disabled">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
            </template>
        </el-table-column>
        <el-table-column width="280">
            <template #header>
                <el-cascader v-model="find.volunteerOne" :options="majors" placeholder="第一志愿" :props="props"
                    @change="Finds" clearable />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerOne" :options="majors" placeholder="无第一志愿" :props="props"
                    @change="Five(scope.row)" />
            </template>
        </el-table-column>
        <el-table-column label="第二志愿" width="280">
            <template #header>
                <el-cascader v-model="find.volunteerTwo" :options="majors" placeholder="第二志愿" :props="props"
                    @change="Finds" clearable />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerTwo" :options="majors" placeholder="无第二志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column label="第三志愿" width="280">
            <template #header>
                <el-cascader v-model="find.volunteerThree" :options="majors" placeholder="第三志愿" :props="props"
                    @change="Finds" clearable />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerThree" :options="majors" placeholder="无第三志愿" :props="props"
                    clearable />
            </template>
        </el-table-column>
        <el-table-column label="第四志愿" width="280">
            <template #header>
                <el-cascader v-model="find.volunteerFour" :options="majors" placeholder="第四志愿" :props="props"
                    @change="Finds" clearable />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerFour" :options="majors" placeholder="无第四志愿" :props="props"
                    clearable />
            </template>
        </el-table-column>
        <el-table-column width="190">
            <template #header>
                <el-input placeholder="户口所在地" v-model="find.location" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.location"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="190">
            <template #header>
                <el-input placeholder="毕业学校" v-model="find.school" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.school"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="140">
            <template #header>
                <el-input placeholder="本人联系电话" v-model="find.contact" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.contact"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="110">
            <template #header>
                <el-input placeholder="联系人" v-model="find.contacts" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.contacts"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="140">
            <template #header>
                <el-input placeholder="联系电话一" v-model="find.contactOne" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.contactOne"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="140">
            <template #header>
                <el-input placeholder="联系电话二" v-model="find.contactTwo" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.contactTwo" placeholder="暂无"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="110">
            <template #header>
                <el-input placeholder="家长姓名" v-model="find.parents" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.parents"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="130">
            <template #header>
                <el-select v-model="find.nature" placeholder="户口性质" @change="Finds" clearable>
                    <el-option v-for="(nature, index) of natures" :key="index" :label="nature" :value="nature" />
                </el-select>
            </template>
            <template #default="scope">
                <el-select v-model="scope.row.nature">
                    <el-option v-for="(nature, index) of natures" :key="index" :label="nature" :value="nature" />
                </el-select>
            </template>
        </el-table-column>
        <el-table-column width="140">
            <template #header>
                <el-select v-model="find.tuition" placeholder="是否免学费" @change="Finds" clearable>
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </template>
            <template #default="scope">
                <el-radio-group v-model="scope.row.tuition">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
            </template>
        </el-table-column>
        <el-table-column width="130">
            <template #header>
                <el-select v-model="find.lodge" placeholder="是否内宿" @change="Finds" clearable>
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </template>
            <template #default="scope">
                <el-radio-group v-model="scope.row.lodge">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
            </template>
        </el-table-column>
        <el-table-column width="130">
            <template #header>
                <el-select v-model="find.league" placeholder="共青团员" @change="Finds" clearable>
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </template>
            <template #default="scope">
                <el-radio-group v-model="scope.row.league">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
            </template>
        </el-table-column>
        <el-table-column width="130">
            <template #header>
                <el-select v-model="find.regulate" placeholder="接受调剂" @change="Finds" clearable>
                    <el-option label="是" :value="true" />
                    <el-option label="否" :value="false" />
                </el-select>
            </template>
            <template #default="scope">
                <el-radio-group v-model="scope.row.regulate">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                </el-radio-group>
            </template>
        </el-table-column>
        <el-table-column width="200">
            <template #header>
                <el-input placeholder="备注" v-model="find.remarks" @change="Finds"></el-input>
            </template>
            <template #default="scope">
                <el-input v-model="scope.row.remarks" placeholder="暂无"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="110" prop="enroll.name">
            <template #header>
                <el-input placeholder="录入人" v-model="find.enroll" @change="Finds"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新日期" width="170" @change="Finds">
            <template #header>
                <el-date-picker v-model="find.updated_at" type="date" placeholder="更新时间" value-format="YYYY-MM-DD"
                    @change="Finds" />
            </template>
        </el-table-column>
        <el-table-column fixed="right" width="160" align="right">
            <template #header>
                <el-input-number v-model="part" :min="1" :max="enrolls.length % 10 ? part : 888888" @change="Finds('part')" />
            </template>
            <template #default="scope">
                <el-button @click="Find(scope.row)" type="warning">修改</el-button>
                <el-button @click="Del(scope.row.id)" type="danger">删除</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>
.el-table :deep(.el-input__wrapper) {
    box-shadow: unset;
    background: unset;
}

:deep(.el-table__header) .el-input__inner {
    font-weight: bold;
}

:deep(.el-table__header) .el-input__inner::-webkit-input-placeholder {
    color: var(--el-text-color-secondary);
}

:deep(.el-table__header) .el-input-number {
    width: 80%;
    margin: auto;
    display: block;
}

.el-table :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}

.el-table :deep(.el-input__wrapper:hover) {
    box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

.el-table :deep(.el-input__prefix) {
    font-size: 0;
    overflow: hidden;
}

.el-table :deep(.el-date-editor.el-input) {
    --el-date-editor-width: 100%;
}

:deep(.el-cascader) {
    width: 100%;
}

</style>
