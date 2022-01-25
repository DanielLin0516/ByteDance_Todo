import { uuid } from './utils'
export default {
    name: 'workshop',
    columns:
        [
            {
                id: 1,
                title: "Not Started",
                items: [
                    {
                        id: uuid(),
                        content: "the first thing xxxxxxxx",
                        description:"oooooo",
                        actions:[
                            {
                                username: '没想好叫啥',
                                action: '把任务从 A移动到B',
                                // action: 有人 创建了任务 2022-01-25
                                //         有人 把任务从A移动到了B 2022-01-25
                                actionTime: '2022-01-25 21:05:24'
                            },
                            {
                                username: '没想好叫啥',
                                action: '把任务从 A移动到B',
                                // action: 有人 创建了任务 2022-01-25
                                //         有人 把任务从A移动到了B 2022-01-25
                                actionTime: '2022-01-25 21:05:24'
                            }
                        ]
                    },
                    {
                        id: uuid(),
                        content: "the second thingxxxxxxxxx",
                        description:"1111111111"
                    },
                    {
                        id: uuid(),
                        content: '我爱你',
                        description:"2222222222"
                    }
                ],
            },
            {
                id: 2,
                title: "Doing",
                items: [
                    {
                        id: uuid(),
                        content: "the 3333 thing xxxxxxxx",
                        description:"333333333333"
                    },
                    {
                        id: uuid(),
                        content: "the 4444 thing xxxxxx",
                        description:"44444www"
                    },
                ],
            },
            {
                id: 3,
                title: "已完成!!",
                items: [],
            },
        ]
}