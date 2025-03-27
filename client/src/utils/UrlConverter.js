const UrlConverter = (name) => {
  const url = name
    .toString()
    .replaceAll(" ", "-")
    .replaceAll(",", "-")
    .replaceAll("(", "-")
    .replaceAll(")", "-")
    .replaceAll("/", "-")
    .replaceAll(":", "-")
    .replaceAll("%", "-")
    .replaceAll("&", "-")
    .replaceAll("?", "-")
    .replaceAll("!", "-")
    .replaceAll("#", "-");
  return url
}

export default UrlConverter