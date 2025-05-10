# Classi Library
classi.jpのapiをtypescript/javascriptを用いて簡易に利用できるようにしたライブラリ

# Usage
```javascript
import classi from "classi.ts/classi"
async function main(){
    const username = `{ Your classi username }`
    const password = `{ Your classi password }`
    //アカウントidを取得
    const cookie = await classi.getCookies(username, password);
    //最新のメッセージを取得
    const messages = await classi.messages.get.newmessages(cookie)
    const message = messages[0].message
    console.log(
        `${message.user.name}:\n`,
        `${message.body.text}`
    )
}
main()
```