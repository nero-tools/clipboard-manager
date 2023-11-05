// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;

use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};
use tauri::{GlobalShortcutManager, Manager};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let open = CustomMenuItem::new("open".to_string(), "Open");
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(open).add_item(quit);
    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| match event {
            SystemTrayEvent::DoubleClick {
                position: _,
                size: _,
                ..
            } => {
                let window = app.get_window("main").unwrap();
                window.show().unwrap();
                let _ = window.set_focus();
                let _ = window.set_always_on_top(true);
            }
            SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
                "open" => {
                    let window = app.get_window("main").unwrap();
                    window.show().unwrap();
                    let _ = window.set_focus();
                    let _ = window.set_always_on_top(true);
                }
                "quit" => {
                    std::process::exit(0);
                }
                _ => {}
            },
            _ => {}
        })
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            tauri::WindowEvent::Focused(focus) => {
                if !focus && !event.window().is_decorated().unwrap() {
                    let _ = event.window().hide();
                }
            }
            _ => {}
        })
        .plugin(tauri_plugin_clipboard::init())
        .invoke_handler(tauri::generate_handler![greet])
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            tauri::RunEvent::Ready => {
                if !is_linux_wayland() {
                    let app_handle = _app_handle.clone();
                    app_handle
                        .global_shortcut_manager()
                        .register("CmdOrCtrl+1", move || {
                            let window = app_handle.get_window("main").unwrap();
                            window.show().unwrap();
                            let _ = window.set_focus();
                            let _ = window.set_always_on_top(true);
                        })
                        .unwrap();
                }
            }
            _ => {}
        });
}

#[cfg(target_os = "linux")]
fn is_linux_wayland() -> bool {
    if let Some(session_type) = env::var("XDG_SESSION_TYPE").ok() {
        if session_type == "wayland" {
            return true;
        }
    }

    return false;
}

#[cfg(not(target_os = "linux"))]
fn is_linux_wayland() -> bool {
    return false;
}
