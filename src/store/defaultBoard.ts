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
                        actions:[]
                    },
                    {
                        id: uuid(),
                        content: "the second thingxxxxxxxxx",
                        description:"1111111111",
                        actions:[]
                    },
                    {
                        id: uuid(),
                        content: '我爱你',
                        description:"2222222222",
                        actions:[]
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
                        description:"333333333333",
                        actions:[]
                    },
                    {
                        id: uuid(),
                        content: "the 4444 thing xxxxxx",
                        description:"44444www",
                        actions:[]
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