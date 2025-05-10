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
exports.YEAR = void 0;
exports.getCookies = getCookies;
exports.is_valid = is_valid;
exports.test = test;
exports.YEAR = new Date().getFullYear();
function getcsrf(cookie) {
    return new Promise((resolve, reject) => {
        fetch("https://id-api.classi.jp/api/v1/csrf_token", {
            headers: {
                Cookie: cookie,
            },
        })
            .then((r) => {
            const cookie = r.headers.get("Set-Cookie");
            r.json().then((res) => {
                resolve([cookie, res.data]);
            });
        })
            .catch((err) => {
            reject(err);
        });
    });
}
function withpass(cookie, username, pass) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const csrf = yield getcsrf(cookie);
        const body = {
            username: username,
            password: pass,
            saveId: false,
        };
        cookie = csrf[0];
        fetch("https://id-api.classi.jp/api/v1/login/with_password", {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
                "X-Csrf-Token": csrf[1],
            },
            method: "POST",
            body: JSON.stringify(body),
        }).then((res) => {
            resolve(String(res.headers.get("Set-Cookie")));
        });
    }));
}
function contin(cookie) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fetch("https://id-api.classi.jp/api/v1/login/continue", {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
            },
            method: "GET",
        })
            .then((res) => {
            resolve(String(res.headers.get("Set-Cookie")));
        })
            .catch((err) => reject(err));
    }));
}
function getCookies(username, pass) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        let cookie;
        cookie = yield withpass("", username, pass);
        cookie = yield contin(cookie);
        const csrf = yield getcsrf(cookie);
        fetch("https://id-api.classi.jp/api/v1/login/issue_cookie", {
            headers: {
                "Content-Type": "application/json",
                Cookie: cookie,
                "X-Csrf-Token": csrf[1],
            },
            method: "POST",
        })
            .then((res) => {
            cookie = String(res.headers.get("Set-Cookie"));
            let status;
            status = "success";
            resolve(cookie);
        })
            .catch((err) => {
            reject({ status: "Retry", cookie: "" });
        });
    }));
}
function is_valid(cookie) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        fetch("https://platform.classi.jp/communication/api/v1/user", {
            headers: {
                Cookie: cookie,
            },
            method: "GET",
        }).then((res) => {
            const st = res.status;
            if (st == 200) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        });
    }));
}
function test(username, password) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const cookie = yield getCookies(username, password);
        const whether = yield is_valid(cookie);
        resolve(whether);
    }));
}
