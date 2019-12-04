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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
module.exports = function (app) {
    app.log("STARTING GEMMY BUFFET");
    /***
     * Listens for a server branch to open a PR
     */
    app.on('pull_request.opened', function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var pullRequestBranch, check, check_id, plutonicRepo, plutonicSha, gemLock, gemLockContents, updateCheck;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.log("PR OPENED");
                    pullRequestBranch = context.payload.pull_request.head.ref;
                    check = {
                        head_sha: context.payload.pull_request.head.sha,
                        name: "Checking Gemfile.lock",
                        owner: 'adamb3ard',
                        repo: 'dummy_server'
                    };
                    check_id = 1;
                    return [4 /*yield*/, context.github.checks.create(check).then(function (data) {
                            app.log("CREATED CHECK");
                            check_id = data.data.id;
                        })];
                case 1:
                    _a.sent();
                    plutonicRepo = {
                        branch: 'master',
                        owner: 'adamb3ard',
                        repo: 'dummy_plutonic'
                    };
                    return [4 /*yield*/, context.github.repos.getBranch(plutonicRepo).then(function (plutonic) {
                            plutonicSha = plutonic.data.commit.sha;
                        })
                        //Get Gemfile.lock contents
                    ];
                case 2:
                    _a.sent();
                    gemLock = {
                        owner: 'adamb3ard',
                        repo: 'dummy_server',
                        ref: pullRequestBranch,
                        path: 'Gemfile.lock'
                    };
                    return [4 /*yield*/, context.github.repos.getContents(gemLock).then(function (data) {
                            gemLockContents = data.data;
                        })];
                case 3:
                    _a.sent();
                    updateCheck = {
                        check_run_id: check_id,
                        owner: 'adamb3ard',
                        repo: 'dummy_server'
                    };
                    //Check if the gemfile contains the latest hash
                    if (Buffer.from(gemLockContents.content, 'base64').toString().includes(plutonicSha)) {
                        app.log('CONTAINS THE SHA');
                        updateCheck.conclusion = "success";
                        context.github.checks.update(updateCheck);
                    }
                    else {
                        app.log("DOES NOT CONTAIN LATEST SHA");
                        updateCheck.conclusion = "failure";
                        context.github.checks.update(updateCheck);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
    /***
     * Listens for a server branch to reopen a PR
     */
    app.on('pull_request.reopened', function (context) { return __awaiter(void 0, void 0, void 0, function () {
        var pullRequestBranch, check, check_id, plutonicRepo, plutonicSha, gemLock, gemLockContents, updateCheck;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    app.log("PR RE-OPENED");
                    pullRequestBranch = context.payload.pull_request.head.ref;
                    check = {
                        head_sha: context.payload.pull_request.head.sha,
                        name: "Checking Gemfile.lock",
                        owner: 'adamb3ard',
                        repo: 'dummy_server'
                    };
                    check_id = 1;
                    return [4 /*yield*/, context.github.checks.create(check).then(function (data) {
                            app.log("CREATED CHECK");
                            check_id = data.data.id;
                        })];
                case 1:
                    _a.sent();
                    plutonicRepo = {
                        branch: 'master',
                        owner: 'adamb3ard',
                        repo: 'dummy_plutonic'
                    };
                    return [4 /*yield*/, context.github.repos.getBranch(plutonicRepo).then(function (plutonic) {
                            plutonicSha = plutonic.data.commit.sha;
                        })
                        //Get Gemfile.lock contents
                    ];
                case 2:
                    _a.sent();
                    gemLock = {
                        owner: 'adamb3ard',
                        repo: 'dummy_server',
                        ref: pullRequestBranch,
                        path: 'Gemfile.lock'
                    };
                    return [4 /*yield*/, context.github.repos.getContents(gemLock).then(function (data) {
                            gemLockContents = data.data;
                        })];
                case 3:
                    _a.sent();
                    updateCheck = {
                        check_run_id: check_id,
                        owner: 'adamb3ard',
                        repo: 'dummy_server'
                    };
                    if (Buffer.from(gemLockContents.content, 'base64').toString().includes(plutonicSha)) {
                        app.log('CONTAINS THE SHA');
                        updateCheck.conclusion = "success";
                        context.github.checks.update(updateCheck);
                    }
                    else {
                        app.log("DOES NOT CONTAIN LATEST SHA");
                        updateCheck.conclusion = "failure";
                        context.github.checks.update(updateCheck);
                    }
                    return [2 /*return*/];
            }
        });
    }); });
};
//# sourceMappingURL=index.js.map