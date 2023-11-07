import { Messager, MessagerList } from "./messager.js";

let messagers_container = $("#messagers-container");
let messager_list = new MessagerList(messagers_container);

let available_models_select = $("#available-models-select");

export function create_messager(
    role,
    content = "",
    model = "",
    temperature = ""
) {
    let message = {
        role: role,
        content: content,
        model: model,
        temperature: temperature,
    };
    let messager = new Messager(message);
    messager_list.push(messager);
}

export function get_selected_llm_model() {
    return available_models_select.val();
}

export function get_latest_messager_container() {
    return messager_list.messagers_container.children().last();
}
export function get_latest_message_content_displayer() {
    return get_latest_messager_container().find(".content-displayer");
}

export function start_latest_message_animation() {
    return get_latest_messager_container()
        .find(".button-group")
        .find(".generate-button")
        .find("i")
        .addClass("fa-spin-fast")
        .css("color", "orange");
}

export function stop_latest_message_animation() {
    let generate_button = get_latest_messager_container()
        .find(".button-group")
        .find(".generate-button");
    let generate_button_icon = generate_button
        .find("i")
        .removeClass("fa-spin-fast")
        .css("color", "green");
    generate_button
        .removeClass("generate-button")
        .addClass("regenerate-button");
}

export function get_request_messages() {
    return messager_list.get_request_messages();
}

export function pop_messager(n = 2) {
    return messager_list.pop(n);
}

export function update_message(json_chunks, content_displayer = null) {
    if (content_displayer === null) {
        content_displayer = get_latest_message_content_displayer();
    }
    json_chunks.forEach(function (item) {
        let choice = item.choices[0];
        let content = choice.delta.content;
        let role = choice.delta.role;
        let finish_reason = choice.finish_reason;
        if (role) {
            console.log("role: " + role);
        }
        if (content) {
            console.log(content);
        }
        if (finish_reason === "stop") {
            console.log("[STOP]");
        }
        console.log(item);
        content_displayer.append(content);
    });
    return json_chunks;
}