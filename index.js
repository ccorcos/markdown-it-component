// Process [component]{a:1, b:2}

var JSON5 = require("json5")

// valid component name character
var componentNameRe = /[a-zA-Z-]/

function component(state, silent) {
	var max = state.posMax
	var start = state.pos

	// Search for [
	if (state.src[start] !== "[") {
		return false
	}
	if (silent) {
		return false
	}

	// Search for ]
	state.pos++
	var found = false
	while (state.pos < max) {
		var char = state.src[state.pos]
		if (char === "]") {
			found = true
			break
		}
		// Assert valid component name character.
		if (!componentNameRe.test(char)) {
			break
		}
		state.pos++
	}

	if (!found) {
		state.pos = start
		return false
	}

	// Parse the component name
	var name = state.src.slice(start + 1, state.pos)

	// Assert {
	state.pos++
	if (state.src[state.pos] !== "{") {
		state.pos = start
		return false
	}

	// Search for }
	var jsonStart = state.pos
	state.pos++
	found = false
	var count = 0
	while (state.pos < max) {
		var char = state.src[state.pos]
		// Handle nested JSON
		if (char === "{") {
			count++
		}
		// Match close token.
		if (char === "}") {
			if (count === 0) {
				found = true
				break
			} else {
				count--
			}
		}
		state.pos++
	}

	if (!found) {
		state.pos = start
		return false
	}

	// Parse JSON props.
	var content = state.src.slice(jsonStart, state.pos + 1)
	var json
	try {
		json = JSON5.parse(content)
	} catch (e) {
		state.pos = start
		return false
	}

	// found!
	state.posMax = state.pos
	state.pos = start + 1

	var token = state.push("component", name, 0)
	token.markup = "[" + name + "]{" + content + "}"
	token.props = json

	state.pos = state.posMax + 1
	state.posMax = max
	return true
}

function attrValue(value) {
	var str = JSON.stringify(value)
	if (str[0] === '"') {
		str = str.slice(1)
	}
	if (str[str.length - 1] === '"') {
		str = str.slice(0, str.length - 1)
	}
	return str
}

function render(tokens, idx, _options, env, self) {
	var token = tokens[idx]
	var props = token.props
	var keys = Object.keys(props)

	for (var i = 0; i < keys.length; i++) {
		var key = keys[i]
		var value = props[key]
		token.attrPush([key, attrValue(value)])
	}

	return self.renderToken(tokens, idx, _options, env, self)
}

module.exports = function component_plugin(md) {
	md.inline.ruler.after("image", "component", component)
	md.renderer.rules["component"] = render
}
