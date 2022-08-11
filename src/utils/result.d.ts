declare namespace Result {
    // 列表数据
    type Pagination = {
        pageNum: number;
        pageSize: number;
        totalPages?: number;
        totalRows?: number;
    }

    type ListObj = Record<string, any>

    export type ListResult = {
        [x: string]: any;
        list: ListObj[];
        pagination?: Pagination;
    }

    export interface pageInfo {
        pageNum: number;
        pageSize: number;
    }

    export interface ObjectType {
        [propName: string]: any
    }
}
