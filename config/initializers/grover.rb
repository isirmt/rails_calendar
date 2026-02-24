Grover.configure do |config|
  config.options = {
    format: "A4",
    landscape: true,
    print_background: true,
    prefer_css_page_size: true,
    wait_until: "networkidle0",
    launch_args: [ "--no-sandbox", "--disable-setuid-sandbox" ]
  }
end
