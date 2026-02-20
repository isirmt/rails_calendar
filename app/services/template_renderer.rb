class TemplateRenderer
  PLACEHOLDER_REGEX = /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/

  def self.render(body:, values:)
    body_text = body.to_s
    value_map = (values || {}).transform_keys!(&:to_s)

    body_text.gsub(PLACEHOLDER_REGEX) do
      key = Regexp.last_match(1)
      value_map.fetch(key, "").to_s
    end
  end
end
