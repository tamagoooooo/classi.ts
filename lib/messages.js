"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messages = void 0;
const default_1 = require("./default");
function get_api(cookie, url) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        if (!url) {
            reject({ error: "no URL" });
        }
        var valid = yield (0, default_1.is_valid)(cookie);
        if (!valid) {
            reject({ error: "invalid cookie" });
        }
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },
        })
            .then((res) => {
            resolve(res);
        })
            .catch((e) => reject(e));
    }));
}
const get = {
    /**
     * 新着メッセージを取得します。
     * @param cookie getCookies()
     * @param year デフォルトで可 前年のメッセージを取得したい場合には引数を指定
     */
    newmessages(cookie, year = default_1.YEAR) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            get_api(cookie, `https://platform.classi.jp/api/v2/groups/newmessages?year=${year}`)
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((e) => reject(e));
        }));
    },
    /**
     * 指定されたグループのメッセージを取得します 一度に20個ずつしか取得できないため、それ以上前のメッセージを取得する場合はpage=を1以上の数に設定
     * @param cookie getCookies()
     * @param groupid 指定したいグループのid
     * @param page //20
     */
    by_groups(cookie, groupid, page = 1) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            get_api(cookie, `https://platform.classi.jp/api/v2/groups/${groupid}/messages?page=${page}`)
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((e) => reject(e));
        }));
    },
    /**
     * 投稿、コメント、見ましたの履歴を最大50件まで取得
     * @param cookie getCookies()
     */
    activities(cookie) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            get_api(cookie, "https://platform.classi.jp/api/v2/groups/activities")
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((e) => reject(e));
        }));
    },
    /**
     * ブックマークしている投稿を取得します。
     * @param cookie getCookies()
     */
    bookmarks(cookie) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            get_api(cookie, "https://platform.classi.jp/api/v2/groups/bookmarks")
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((e) => reject(e));
        }));
    },
    /**
     * 参加しているグループ一覧を取得します
     * @param cookie getCookies()
     */
    allgroups(cookie) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            get_api(cookie, "https://platform.classi.jp/api/v2/groups/")
                .then((res) => res.json())
                .then((res) => resolve(res))
                .catch((e) => reject(e));
        }));
    },
    downloadFile(cookie, file_option) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const valid = (0, default_1.is_valid)(cookie);
            if (!valid) {
                reject({ error: "invalid cookie" });
            }
            else {
                fetch(file_option.download_url, {
                    headers: {
                        Cookie: cookie,
                    },
                }).then((res) => {
                    if (!res.ok) {
                        reject(new Error(`FAILED!\n${res.statusText}`));
                    }
                    resolve(res.body);
                });
            }
        }));
    },
};
function csrf_token(cookie) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const valid = (0, default_1.is_valid)(cookie);
        if (!valid) {
            reject({ error: "invalid cookie" });
        }
        fetch("https://platform.classi.jp/api/v2/csrf/token", {
            headers: {
                Cookie: cookie,
            },
        }).then((res) => __awaiter(this, void 0, void 0, function* () {
            const token = yield res.json();
            const cookie = res.headers.get("Set-Cookie") || "";
            resolve({ token: token.token, cookie });
        }));
    }));
}
const set = {
    /**
     * 指定したグループを順位付けしたうえでマイグループに登録します
     * @param cookie getCookies()
     * @param groups 登録したいグループのidを順位で並べたもの
     * @returns status 200ならTrue、それ以外ならFalse
     */
    mygroup(cookie, groups) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const valid = (0, default_1.is_valid)(cookie);
            if (!valid) {
                reject({ error: "invalid cookie" });
            }
            if (groups.length > 40) {
                reject({ error: "too many groups" });
            }
            var mygroups = [];
            for (var i = 0; i < groups.length; i++) {
                mygroups.push({
                    id: groups[i],
                    sort_no: i + 1,
                });
            }
            fetch("https://platform.classi.jp/api/v2/groups/mygroup", {
                method: "PUT",
                headers: {
                    Cookie: cookie,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    year: String(default_1.YEAR),
                    mygroups: mygroups,
                }),
            }).then((res) => {
                if (res.status == 200) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        }));
    },
    /**
     * 指定したメッセージidのメッセージをブックマークに登録/解除します
     * @param cookie getCookies()
     * @param messageid ブックマークしたいメッセージのid
     * @param undo ブックマークを解除する場合はTrue
     * @returns True:成功 False:すでにブックマーク登録/解除 済み
     */
    bookmark(cookie, messageid, undo = false) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const valid = (0, default_1.is_valid)(cookie);
            if (!valid) {
                reject({ error: "invalid cookie" });
            }
            if (!messageid) {
                reject({ error: "no messageid" });
            }
            const tokens = yield csrf_token(cookie);
            const token = tokens.token;
            const cookie_n = tokens.cookie;
            if (undo) {
                fetch(`https://platform.classi.jp/api/v2/groups/bookmarks?message_id=${messageid}`, {
                    method: "DELETE",
                    headers: {
                        Cookie: `${cookie}`,
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }).then((res) => {
                    if (res.status == 200) {
                        resolve(true);
                    }
                    else if (res.status == 400) {
                        resolve(false);
                    }
                    else {
                        reject(new Error(`CODE:${res.status} \n ${JSON.stringify(res, null, 2)}`));
                    }
                });
            }
            else {
                fetch("https://platform.classi.jp/api/v2/groups/bookmarks", {
                    method: "POST",
                    headers: {
                        Cookie: `${cookie};${cookie_n}`,
                        "Content-Type": "application/json",
                        "X-Csrf-Token": String(token),
                    },
                    body: JSON.stringify({ message_id: messageid }),
                }).then((res) => __awaiter(this, void 0, void 0, function* () {
                    const text = yield res.text();
                    if (res.status == 200) {
                        resolve(true);
                    }
                    else if (res.status == 400) {
                        resolve(false);
                    }
                    else {
                        reject(new Error(`CODE:${res.status} \n ${text}`));
                    }
                }));
            }
        }));
    },
    /**
     * 指定したメッセージidのメッセージを既読にします
     * @param cookie getCookies()
     * @param messageid 既読をつけたいメッセージのid
     * @returns True:成功 False:すでに既読
     */
    read(cookie, messageid) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const valid = (0, default_1.is_valid)(cookie);
            if (!valid) {
                reject({ error: "invalid cokie" });
            }
            fetch(`https://platform.classi.jp/api/v3/group_messages/${messageid}/mark_as_read`, {
                method: "POST",
                headers: {
                    Cookie: cookie,
                },
            }).then((res) => __awaiter(this, void 0, void 0, function* () {
                console.log(res);
                const text = yield res.text();
                if (res.status == 201) {
                    resolve(true);
                }
                else if (res.status == 204) {
                    resolve(false);
                }
                else {
                    reject(new Error(`CODE:${res.status}\n${text}`));
                }
            }));
        }));
    },
    /**
     * 指定したメッセージidのメッセージに"見ました"をつけます
     * @param cookie getCookies()
     * @param messageid "見ました"をつけたいメッセージのid
     * @param undo "見ました"を外す場合はTrue
     * @returns True:成功 false:すでに"見ました"
     */
    mimashita(cookie, messageid, undo = false) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const valid = (0, default_1.is_valid)(cookie);
            if (!valid) {
                reject({ error: "invalid cokie" });
            }
            if (undo) {
                fetch(`https://platform.classi.jp/api/v3/group_messages/${messageid}/mimashita`, {
                    method: "DELETE",
                    headers: {
                        Cookie: cookie,
                    },
                }).then((res) => __awaiter(this, void 0, void 0, function* () {
                    console.log(res);
                    const text = yield res.text();
                    if (res.status == 204) {
                        resolve(true);
                    }
                    else {
                        reject(new Error(`CODE:${res.status}\n${text}`));
                    }
                }));
            }
            else {
                fetch(`https://platform.classi.jp/api/v3/group_messages/${messageid}/mimashita`, {
                    method: "POST",
                    headers: {
                        Cookie: cookie,
                    },
                }).then((res) => __awaiter(this, void 0, void 0, function* () {
                    console.log(res);
                    const text = yield res.text();
                    if (res.status == 201) {
                        resolve(true);
                    }
                    else if (res.status == 204) {
                        resolve(false);
                    }
                    else {
                        reject(new Error(`CODE:${res.status}\n${text}`));
                    }
                }));
            }
        }));
    },
};
exports.messages = { get, set };
