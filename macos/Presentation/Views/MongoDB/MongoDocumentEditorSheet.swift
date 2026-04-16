// MongoDocumentEditorSheet.swift
// Gridex
//
// JSON document editor for inserting MongoDB documents.

import SwiftUI

struct MongoDocumentEditorSheet: View {
    let collectionName: String
    let detectedFields: [(name: String, type: String)]
    let onInsert: (String) async -> Result<Void, Error>

    @Environment(\.dismiss) private var dismiss
    @State private var jsonText: String = ""
    @State private var isInserting = false
    @State private var errorMessage: String?

    var body: some View {
        VStack(spacing: 0) {
            // Header
            HStack(spacing: 8) {
                Image(systemName: "doc.text")
                    .foregroundStyle(.green)
                Text("Insert Document")
                    .font(.system(size: 14, weight: .semibold))
                Text("·")
                    .foregroundStyle(.tertiary)
                Text(collectionName)
                    .font(.system(size: 12, design: .monospaced))
                    .foregroundStyle(.secondary)
                Spacer()
                Button(action: { jsonText = templateJSON() }) {
                    Label("Reset", systemImage: "arrow.counterclockwise")
                        .font(.system(size: 11))
                }
                .buttonStyle(.plain)
                .help("Reset to template from detected fields")
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)

            Divider()

            // JSON editor
            ScrollView {
                TextEditor(text: $jsonText)
                    .font(.system(size: 12, design: .monospaced))
                    .frame(minHeight: 280)
                    .padding(8)
                    .scrollContentBackground(.hidden)
                    .background(Color(nsColor: .textBackgroundColor))
            }
            .frame(minHeight: 300)

            if let errorMessage {
                Divider()
                HStack(spacing: 6) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundStyle(.red)
                    Text(errorMessage)
                        .font(.system(size: 11))
                        .foregroundStyle(.red)
                        .lineLimit(3)
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Color.red.opacity(0.08))
            }

            Divider()

            // Footer
            HStack {
                if !detectedFields.isEmpty {
                    Text("\(detectedFields.count) fields detected from samples")
                        .font(.system(size: 11))
                        .foregroundStyle(.tertiary)
                }
                Spacer()
                Button("Cancel") { dismiss() }
                    .keyboardShortcut(.cancelAction)
                Button(action: insert) {
                    HStack(spacing: 6) {
                        if isInserting {
                            ProgressView().controlSize(.small)
                        }
                        Text("Insert")
                    }
                }
                .buttonStyle(.borderedProminent)
                .keyboardShortcut(.defaultAction)
                .disabled(jsonText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || isInserting)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 12)
        }
        .frame(width: 560, height: 460)
        .onAppear {
            if jsonText.isEmpty {
                jsonText = templateJSON()
            }
        }
    }

    private func templateJSON() -> String {
        // Build a template document from detected fields, excluding _id
        // (Mongo will auto-generate _id on insert)
        let fields = detectedFields.filter { $0.name != "_id" }
        if fields.isEmpty {
            return """
            {
              "name": "",
              "createdAt": { "$date": "\(ISO8601DateFormatter().string(from: Date()))" }
            }
            """
        }
        var lines: [String] = ["{"]
        for (idx, field) in fields.enumerated() {
            let placeholder = templateValue(for: field.type)
            let comma = idx < fields.count - 1 ? "," : ""
            lines.append("  \"\(field.name)\": \(placeholder)\(comma)")
        }
        lines.append("}")
        return lines.joined(separator: "\n")
    }

    private func templateValue(for type: String) -> String {
        switch type {
        case "string": return "\"\""
        case "integer": return "0"
        case "double": return "0.0"
        case "boolean": return "false"
        case "date": return "{ \"$date\": \"\(ISO8601DateFormatter().string(from: Date()))\" }"
        case "objectId": return "{ \"$oid\": \"000000000000000000000000\" }"
        case "document": return "{}"
        case "array": return "[]"
        default: return "null"
        }
    }

    private func insert() {
        errorMessage = nil
        isInserting = true
        Task {
            let result = await onInsert(jsonText)
            isInserting = false
            switch result {
            case .success:
                dismiss()
            case .failure(let error):
                errorMessage = error.localizedDescription
            }
        }
    }
}
