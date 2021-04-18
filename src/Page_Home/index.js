/**
 * 修改手机号
 */
import React, { useEffect, useState } from "react";
import {
    Button,
    Input,
    Cells,
    CellHeader,
    Cell,
    CellBody, CellBodyExplan,

} from "@wecode/react-weui";

import * as css from "./index.module.css";

export default function PhoneNumber() {
    const [accessToken, setCode] = useState(""); //access_token
    const [codecode, setCodeCode] = useState(""); //code
    const [corpUserId, setcorpUserId] = useState(""); //输入用户学号
    const [userInfo, setuserInfo] = useState({}); //查询用户信息
    const [parentCode, setParentCode] = useState(""); //用户部门主管id;managerAccount,变量名称不对
    const [nowUserId, setNowUserId] = useState(""); //通过免登录和获取凭证的access_token获得当前用户的userid
    const [newMobile, setNewMobile] = useState(""); //设置新的手机号
    const [modalVisibale, setModalVisibal] = useState(false)

    const getAccessToken = () => {
        const url = "https://open.welink.huaweicloud.com/api/auth/v2/tickets";
        const _headers = {
            "Content-Type": "application/json;",
            "x-wlk-gray": "0",
        };
        const _params = {
            // eslint-disable-next-line camelcase
            client_id: "20201212114850041741411",
            client_secret: "d276ba16-0b32-4e66-89a2-75556853072e",
        };
        HWH5.fetchInternet(url, {
            method: "post",
            body: JSON.stringify(_params),
            headers: _headers,
            timeout: 6000,
        })
            .then((res) => {
                res.json().then((reply) => {
                    setCode(reply.access_token);
                });
            })
            .catch((error) => {
                console.log("请求异常", error);
                console.log("本地调试有跨域请求的问题");
            });
    };
    const getUserInfobyCorp = (c, corp) => {
        corp === "" && window.alert("请输入学生学号");
        const url = "https://open.welink.huaweicloud.com/api/contact/v3/users";
        const _params = {
            corpUserId: corp,
        };
        HWH5.fetchInternet(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "x-wlk-Authorization": c,
            },
            body: JSON.stringify(_params),
        })
            .then((res) => {
                res.json().then((reply) => {
                    setuserInfo(reply);
                    getParentCode(accessToken, reply.deptCode);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getParentCode = (c, deptCode) => {
        const url =
            "https://open.welink.huaweicloud.com/api/contact/v1/departments/" +
            deptCode;

        HWH5.fetchInternet(url, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "x-wlk-Authorization": c,
            },
        })
            .then((res) => {
                res.json().then((reply) => {
                    if (reply.managerAccount == "") {
                        window.alert("抱歉您查询的学生上级ip未录入系统,暂时无法查询手机修改权限")
                    }
                    setParentCode(reply.managerAccount);

                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getNowUserId = (accessToken, c) => {
        const url =
            "https://open.welink.huaweicloud.com/api/auth/v2/userid?code=" + c;
        if (nowUserId) return;
        HWH5.fetchInternet(url, {
            method: "get",
            headers: {
                "Content-Type": "application/json",
                "x-wlk-Authorization": accessToken,
            },
        })
            .then((res) => {
                res.json().then((reply) => {
                    setNowUserId(reply.userId);
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const changeMobileNumber = (accessToken, corp, mobilenumber) => {
        const url =
            "https://open.welink.huaweicloud.com/api/contact/v1/user/mobilenumber";
        const _params = {
            corpUserId: corp,
            mobileNumber: mobilenumber,
        };
        HWH5.fetchInternet(url, {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "x-wlk-Authorization": accessToken,
            },
            body: JSON.stringify(_params),
        })
            .then((res) => {
                res.json().then(() => {
                    window.alert("修改成功");
                });
            })
            .catch((error) => {
                window.alert(error.message);
            });
    };
    useEffect(() => {
        HWH5.navTitle({ title: "寝室查询功能组" });
        getAccessToken();
        HWH5.getAuthCode()
            .then((data) => {
                setCodeCode(data.code);
            })
            .catch((error) => {
                console.log("获取异常", error);
            });
    }, []);

    return (
        <div className="search_page">
            <Cells>
                <Cell>
                    <CellBody>
                        输入学号查询宿舍
                        <CellBodyExplan>
                            <Input
                                placeholder="请输入学号"
                                value={corpUserId || ""}
                                onChange={(input) => {
                                    setcorpUserId(input ? input.target.value : "");
                                }}
                            ></Input>
                        </CellBodyExplan>
                    </CellBody>

                </Cell>

                <Cell>
                    <CellBody>
                        <Button
                            type="primary"
                            onClick={() => {
                                getUserInfobyCorp(accessToken, corpUserId);
                            }}
                        >
                            查询学生信息
        </Button>

                    </CellBody>
                </Cell>
                <Cell>
                    <CellHeader>
                        姓名
                    </CellHeader>
                    <CellBody style={{ textAlign: "center" }}>
                        {userInfo.userNameCn || ""}
                    </CellBody>
                </Cell>
                <Cell>
                    <CellHeader>
                        性别
                    </CellHeader>
                    <CellBody style={{ textAlign: "center" }}>
                        {userInfo.sex ? (userInfo.sex == "F" ? "女" : "男") : ""}
                    </CellBody>
                </Cell>
                <Cell>
                    <CellHeader>
                        学号
                    </CellHeader>
                    <CellBody style={{ textAlign: "center" }}>
                        {userInfo.corpUserId || " "}
                    </CellBody>
                </Cell>
                <Cell>
                    <CellHeader>
                        手机号
                    </CellHeader>
                    <CellBody style={{ textAlign: "center" }}>
                        {userInfo.mobileNumber || " "}
                    </CellBody>
                </Cell>
                <Cell>
                    <CellBody>
                        <Button
                            onClick={() => {
                                getNowUserId(accessToken, codecode);
                                setModalVisibal(true)
                            }}
                        >
                            查询手机修改权限
        </Button>
                    </CellBody>
                </Cell>
                <Cell>
                    <CellBody>
                        {modalVisibale ?
                            <div className="Modal">
                                {parentCode === "" ? (
                                    ""
                                ) : parentCode === nowUserId ? (
                                    <Input
                                        className={css.input}
                                        placeholder={
                                            "请输入你要修改" + (userInfo.userNameCn || "") + "学生的手机号"
                                        }
                                        onChange={(input) => {
                                            setNewMobile(input ? input.target.value : "");
                                        }}
                                    ></Input>
                                ) : (
                                            <h1>抱歉你不能修改该学生的信息</h1>
                                        )}
                                {parentCode === "" ? (
                                    ""
                                ) : parentCode === nowUserId ? (
                                    <Button
                                        onClick={() => {
                                            // eslint-disable-next-line no-constant-condition
                                            (newMobile.length === 11 || 14) && (newMobile[0] === "+" || "1")
                                                ? changeMobileNumber(accessToken, userInfo.corpUserId, newMobile)
                                                : window.alert(
                                                    "同一个已开户状态学生24小时之内只允许修改手机号3次，请谨慎输入正确格式的手机号，例如+86-15216797305或者15216797305"
                                                );
                                        }}
                                    >
                                        修改
                                    </Button>
                                ) : (
                                            <h1>请试试其他学生</h1>
                                        )}
                            </div>
                            : ""}
                    </CellBody>

                </Cell>


            </Cells>




        </div>
    );
}
