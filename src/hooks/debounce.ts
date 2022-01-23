import { customRef } from "vue";
export default function debouceRef(value: unknown, delay = 500) {
    let timer:any = null;
    return customRef((track, trigger) => {
        return {
            get() {
                track();//跟踪，收集数据
                return value;
            },
            set(newvalue) {
                clearTimeout(timer);
                timer = setTimeout(() => {
                    value = newvalue;
                    trigger();//触发
                }, delay)
            }
        }
    })
} 
