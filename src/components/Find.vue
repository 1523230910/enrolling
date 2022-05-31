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
            take: false,
            id: '',
            name: '',
            volunteerOne: [],
            volunteerTWo: [],
            volunteerThree: [],
            volunteerFour: [],
            updated_at: '',
        }
    }),

    created() {
        if (!localStorage.getItem("login_token")) return false
        this.Finds()
    },

    methods: {
        Scroll() {
            console.log('a')
        },

        Finds() {
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
                this.enrolls = res.data.data
                this.findLoad = false
            })
        },

    }
}
</script>

<template>
    <el-table :data="enrolls" style="width: 100%" height="600" :highlight-current-row="true" v-loading="findLoad">
        <el-table-column prop="id" label="考生号" width="140" fixed>
            <template #header>
                <el-input placeholder="考生号" v-model="find.id" @change="Finds"></el-input>
            </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名" width="80" fixed>
            <template #header>
                <el-input placeholder="姓名" v-model="find.name" @change="Finds"></el-input>
            </template>
        </el-table-column>
        <el-table-column width="280">
            <template #header>
                <el-cascader v-model="find.volunteerOne" :options="majors" placeholder="第一志愿" :props="props"
                    @change="Finds" :clearable="true" />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerOne" :options="majors" placeholder="无第一志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column label="第二志愿" width="280">
            <template #header>
                <el-cascader v-model="find.volunteerTwo" :options="majors" placeholder="第二志愿" :props="props"
                    @change="Finds" :clearable="true" />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerTwo" :options="majors" placeholder="无第二志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column label="第三志愿" width="280">
            <template #header>
                <el-cascader v-model="find.volunteerThree" :options="majors" placeholder="第三志愿" :props="props"
                    @change="Finds" :clearable="true" />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerThree" :options="majors" placeholder="无第三志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column label="第四志愿" width="280">
            <template #header>
                <el-cascader v-model="find.volunteerFour" :options="majors" placeholder="第四志愿" :props="props"
                    @change="Finds" :clearable="true" />
            </template>
            <template #default="scope">
                <el-cascader v-model="scope.row.volunteerFour" :options="majors" placeholder="无第四志愿" :props="props" />
            </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="更新日期" width="170">
            <template #header>
                <el-date-picker v-model="find.updated_at" type="date" placeholder="更新时间" value-format="YYYY-MM-DD"
                    @change="Finds" />
            </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="100">
            <template #default="scope">
                <el-button @click="Load(scope.row.id)" type="warning" disabled>修改</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>

<style scoped>
:deep(.el-table__header) .el-input__wrapper {
    box-shadow: unset;
}

:deep(.el-table__header) .el-input__inner {
    font-weight: bold;
}

:deep(.el-table__header) .el-input__inner::-webkit-input-placeholder {
    color: var(--el-text-color-secondary);
}

:deep(.el-table__header) .el-input__wrapper.is-focus {
    box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
}

:deep(.el-table__header) .el-input__wrapper:hover {
    box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
}

:deep(.el-table__header) .icon-arrow-down {
    opacity: 0;
}

:deep(.el-table__header) .icon-arrow-down.is-reverse {
    opacity: 1;
}

:deep(.el-table__header) .el-input__prefix {
    font-size: 0;
    overflow: hidden;
}

:deep(.el-table__header) .el-date-editor.el-input {
    --el-date-editor-width: 100%;
}
:deep(.el-cascader) {
    width: 100%;
}
</style>
