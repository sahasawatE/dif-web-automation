let issuer_info_objective = new Array(12).fill([])
issuer_info_objective = issuer_info_objective.map((e, i) => {
    if (i !== 10) return new Array(6).fill("")
    else return []
})

let authorized_signer_schema_1 = ["th", "en", "nationality", "card_type", "card_number", "position", "email", "juristic_name"]
let authorized_signer_schema_2 = ["th", "en", "nationality", "card_type", "card_number", "position", "email", "additional_comment", "juristic_name"]
let authorized_signer_schema_3 = ["th", "en", "nationality", "card_type", "card_number", "position", "email", "juristic_name", "date"]
let authorized_signer_schema_4 = ["th", "en", "nationality", "card_type", "card_number", "position", "email"]

let auth_sign_issue_info = new Object()
let auth_sign_fa_for_issue_info = new Object()
let auth_sign_other_info = new Object()
let auth_sign_fa_other = new Object()
let auth_sign_approval = new Object()
let auth_sign_fa_approval = new Object()
let auth_sign_post_sale_report = { issuer: new Object() }

authorized_signer_schema_1.forEach(e => {
    if (e === "th" || e === "en") {
        auth_sign_issue_info[e] = { prefix: "", firstname: "", lastname: "" }
        auth_sign_approval[e] = { prefix: "", firstname: "", lastname: "" }
        auth_sign_fa_approval[e] = { prefix: "", firstname: "", lastname: "" }
    }
    else {
        auth_sign_issue_info[e] = ""
        auth_sign_approval[e] = ""
        auth_sign_fa_approval[e] = ""
    }
})

authorized_signer_schema_2.forEach(e => {
    if (e === "th" || e === "en") {
        auth_sign_fa_for_issue_info[e] = { prefix: "", firstname: "", lastname: "" }
        auth_sign_fa_other[e] = { prefix: "", firstname: "", lastname: "" }
    }
    else {
        auth_sign_fa_for_issue_info[e] = ""
        auth_sign_fa_other[e] = ""
    }
})

authorized_signer_schema_3.forEach(e => {
    if (e === "th" || e === "en") {
        auth_sign_other_info[e] = { prefix: "", firstname: "", lastname: "" }
    }
    else {
        auth_sign_other_info[e] = ""
    }
})

authorized_signer_schema_4.forEach(e => {
    if (e === "th" || e === "en") {
        auth_sign_post_sale_report['issuer'][e] = { prefix: "", firstname: "", lastname: "" }
    }
    else {
        auth_sign_post_sale_report['issuer'][e] = ""
    }
})

let schema = {
    init_issuer_profile: {
        executive_sum: "",
        issuer_info: {
            postal_id: "",
            tax_id: "",
            tax_area: "",
            mobile_phone: "",
            objective: issuer_info_objective,
            issuer_contact: {
                ceo_name: "",
                ceo_position: "",
                ceo_email: "",
                cfo_name: "",
                cfo_position: "",
                cfo_email: ""
            },
            ql_editor_part_1: new Array(36).fill(""),
            nature_of_buz: {
                profile_th: "",
                profile_en: ""
            },
            regist_and_paidup_cap: "",
            total_loan_amount: {
                name: "",
                symbo: "",
                date: "",
                maturity: "",
                value: ""
            },
            bill_of_exc_list: {
                name: "",
                symbo: "",
                date: "",
                maturity: "",
                value: ""
            },
            key_fin: {
                latest_year: new Array(52).fill(0),
                year_before_latest_year: new Array(52).fill(0),
                quater: new Array(52).fill(0)
            },
            fiancial_convennant_info: {
                ratio_team: "",
                ratio_team_other: "",
                comparison: "",
                ratio_end_period: "",
                com_ref: "",
                con_ref: "",
                ratio_formula: "",
                monitor_period: "",
                ratio_indus_avg: "",
                ratio_issue_ybly: "",
                ratio_ly: "",
                ratio_iq: "",
                ybly: "",
                ly: "",
                q: ""
            },
            interest_coverage: "",
            current_ratio: "",
            debt_to_equity: "",
            quick_ratio: "",
            liquidity_coverage_ratio: "",
            auditor_firm: "",
            legal_ad: {
                name_th: "",
                name_en: "",
                nation: "",
                id: "",
                reg_app: ""
            },
            ql_editor_part_2: new Array(14).fill(""),
            committee: {
                name: "",
                asof: ""
            },
            number_of_employee: "",
            ql_editor_part_3: new Array(2).fill(""),
            accounting_period: new Array(2).fill(""),
            statement_feq: "",
            debt_position: {
                financial_institution: "",
                bond: "",
                other: ""
            },
            debt_asof: ""
        },
        authorized_signer: {
            issuer_info: auth_sign_issue_info,
            fa_for_issuer_info: auth_sign_fa_for_issue_info,
            other_info: auth_sign_other_info,
            fa_other: auth_sign_fa_other,
            approval: auth_sign_approval,
            fa_approval: auth_sign_fa_approval,
            post_sale_report: auth_sign_post_sale_report
        },
        selling_info: {
            ql_editor: new Array(24).fill(""),
            tc: {
                bond_info: {
                    number_of_bond: "",
                    selling_value: "",
                    total_selling_value: "",
                    greenshoe_total_unit: "",
                    total_selling_unit: ""
                },
                trade_reg_date: "",
                collateral: {
                    type: "",
                    info: ""
                },
                financial_ad: {
                    fin_ad: ""
                },
                bond_represent: {
                    bond: ""
                }
            },
            issuer_service_underwriter: {
                list: {
                    assigned: "",
                    address: "",
                    tel: "",
                    conflict_detail: "",
                },
                dealer: {
                    name: "",
                    conflict_detail: ""
                }
            },
            transfer_rest_detail: "",
            coordinator: {
                name: "",
                tel: "",
                email: "",
                position: "",
                type: "",
            },
            address_and_invoice: {
                code: "",
                office: "",
                address: {
                    th: "",
                    en: ""
                },
                invoice: {
                    contact_person: "",
                    tel: "",
                    email: "",
                    tex_id: ""
                }
            }
        }
    }
}

module.exports = schema