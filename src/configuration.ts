
let config: any = {};

export function configuration(attr = '') {
    return (target: any, key: string): void => {
        delete target[key];
        Object.defineProperty(target, key, {
            enumerable: true,
            configurable: false,
            get: () => {
                return configuration.get(attr);
            }
        });
    };
}

configuration.set = (CONFIG: any): void => {
    config = { ...config, ...CONFIG };
};

configuration.get = (attr: string): any => {
    if (!attr) {
        return config;
    }

    const path = attr.split('.');
    let val = config;
    val = path.reduce((data: any, value: string) => {
        if (value in data) {
            return data[value];
        }
    }, val);

    return val;
};
