export const oss = {
    data() {
        return {
            oss_url: process.env.VUE_APP_ALI_OSS_URL,
            oss_cdn: process.env.VUE_APP_ALI_OSS_CDN,
        }
    }
}

export const scroll = {
    data() {
        return {
            scroll_config: {
                always: false,
                smooth: true,
                notSmoothOnInit: true,
                scrollonremoved: true,
                smoothonremoved: false
            },
        }
    }
}

export const paginate = {
    data() {
        return {
            payload: {
                sort: 'id',
                by: 'desc',
                size: 20,
                page: 1,
            },
            total: 0,
            last: 1,
            items: [],
            dialog: false,
            index: -1,
            row: null,
        }
    },
    methods: {
        added(data) {
            this.items.unshift(data)
            this.dialog = false
        },
        edit(row, index) {
            this.row = row
            this.index = index
        },
        edited(data) {
            this.$set(this.items, this.index, data)
            this.clear()
        },
        clear() {
            this.row = null
            this.index = -1
        },
        changeSort({ column, prop, order }) {
            this.payload.sort = prop;
            if (order === "ascending") this.payload.by = "asc";
            if (order === "descending") this.payload.by = "desc";
            this.search();
        },
        changeSize(val) {
            this.payload.size = val;
            this.search();
        },
        jumpPage(val) {
            this.paginate(val);
            this.search();
        },
        paginate(p) {
            if (p > this.last) p = this.last;
            if (p < 1) p = 1;
            this.payload.page = p;
            this.search();
        },
    }
}
