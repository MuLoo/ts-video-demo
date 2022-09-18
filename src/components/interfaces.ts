// 组件配置接口 约束组件使用人员
export interface Ipopup {
    width?: string;
    height?: string;
    title?: string;
    pos?: string;
    mask?: boolean;
    content?: (ele: HTMLElement) => void;
}

// 组件接口，约束组件开发人员
export interface Icomponent {
    tempContainer: HTMLElement;
    mask: HTMLElement;
    init: () => void;
    template: () => void;
    handle: () => void;
}