"use client"

export function getMarkdown() {
    return fetch("/test.md").then((r) => r.text());
}