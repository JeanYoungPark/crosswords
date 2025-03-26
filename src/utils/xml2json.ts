interface XmlProcessingObject {
    toObj: (xml: Node) => any;
    toJson: (o: any, name?: string, ind?: string) => string;
    innerXml: (node: Node) => string;
    escape: (txt: string) => string;
    removeWhite: (e: Element) => Element;
}

export const xml2json = (xml: string, tab?: string): string => {
    const X: XmlProcessingObject = {
        toObj: function (xml: Node) {
            var o: any = {};
            if (xml.nodeType == 1) {
                // element node ..
                if ((xml as Element).attributes.length)
                    // element with attributes  ..
                    for (var i = 0; i < (xml as Element).attributes.length; i++)
                        o["@" + (xml as Element).attributes[i].nodeName] = ((xml as Element).attributes[i].nodeValue || "").toString();

                if (xml.firstChild) {
                    // element has child nodes ..
                    var textChild = 0,
                        cdataChild = 0,
                        hasElementChild = false;
                    for (var n: ChildNode | null = xml.firstChild; n; n = n.nextSibling) {
                        if (n.nodeType == 1) hasElementChild = true;
                        else if (n.nodeType == 3 && (n as Text).nodeValue!.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                        else if (n.nodeType == 4) cdataChild++; // cdata section node
                    }

                    if (hasElementChild) {
                        if (textChild < 2 && cdataChild < 2) {
                            // structured element with evtl. a single text or/and cdata node ..
                            X.removeWhite(xml as Element);
                            for (var n: ChildNode | null = xml.firstChild; n; n = n.nextSibling) {
                                if (n.nodeType == 3)
                                    // text node
                                    o["#text"] = X.escape((n as Text).nodeValue!);
                                else if (n.nodeType == 4)
                                    // cdata node
                                    o["#cdata"] = X.escape((n as Text).nodeValue!);
                                else if (o[n.nodeName]) {
                                    // multiple occurence of element ..
                                    if (o[n.nodeName] instanceof Array) o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                                    else o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                                } // first occurence of element..
                                else o[n.nodeName] = X.toObj(n);
                            }
                        } else {
                            // mixed content
                            if (!(xml as Element).attributes.length) o = X.escape(X.innerXml(xml));
                            else o["#text"] = X.escape(X.innerXml(xml));
                        }
                    } else if (textChild) {
                        // pure text
                        if (!(xml as Element).attributes.length) o = X.escape(X.innerXml(xml));
                        else o["#text"] = X.escape(X.innerXml(xml));
                    } else if (cdataChild) {
                        // cdata
                        if (cdataChild > 1) o = X.escape(X.innerXml(xml));
                        else for (var n: ChildNode | null = xml.firstChild; n; n = n.nextSibling) o["#cdata"] = X.escape((n as Text).nodeValue!);
                    }
                }
                if (!(xml as Element).attributes.length && !xml.firstChild) o = null;
            } else if (xml.nodeType == 9) {
                // document.node
                o = X.toObj((xml as Document).documentElement);
            } else console.error("unhandled node type: " + xml.nodeType);
            return o;
        },

        toJson: function (o: any, name?: string, ind?: string): string {
            var json = name ? '"' + name + '"' : "";
            if (o instanceof Array) {
                for (var i = 0, n = o.length; i < n; i++) o[i] = X.toJson(o[i], "", ind + "\t");
                json += (name ? ":[" : "[") + (o.length > 1 ? "\n" + ind + "\t" + o.join(",\n" + ind + "\t") + "\n" + ind : o.join("")) + "]";
            } else if (o == null) json += (name && ":") + "null";
            else if (typeof o == "object") {
                var arr = [];
                for (var m in o) arr[arr.length] = X.toJson(o[m], m, ind + "\t");
                json += (name ? ":{" : "{") + (arr.length > 1 ? "\n" + ind + "\t" + arr.join(",\n" + ind + "\t") + "\n" + ind : arr.join("")) + "}";
            } else if (typeof o == "string") json += (name && ":") + '"' + o.toString() + '"';
            else json += (name && ":") + o.toString();
            return json;
        },

        innerXml: function (node: Node): string {
            var s = "";
            if ("innerHTML" in node) s = (node as HTMLElement).innerHTML;
            else {
                var asXml = function (n: Node): string {
                    var s = "";
                    if (n.nodeType == 1) {
                        s += "<" + n.nodeName;
                        for (var i = 0; i < (n as Element).attributes.length; i++)
                            s += " " + (n as Element).attributes[i].nodeName + '="' + ((n as Element).attributes[i].nodeValue || "").toString() + '"';
                        if (n.firstChild) {
                            s += ">";
                            for (var c: ChildNode | null = n.firstChild; c; c = c.nextSibling) s += asXml(c);
                            s += "</" + n.nodeName + ">";
                        } else s += "/>";
                    } else if (n.nodeType == 3) s += (n as Text).nodeValue;
                    else if (n.nodeType == 4) s += "<![CDATA[" + (n as Text).nodeValue + "]]>";
                    return s;
                };
                for (var c = node.firstChild; c; c = c.nextSibling) s += asXml(c);
            }
            return s;
        },

        escape: function (txt: string): string {
            return txt.replace(/[\\]/g, "\\\\").replace(/[\"]/g, '\\"').replace(/[\n]/g, "\\n").replace(/[\r]/g, "\\r");
        },

        removeWhite: function (e: Element): Element {
            e.normalize();
            for (var n = e.firstChild; n; ) {
                if (n.nodeType == 3) {
                    // text node
                    if (!(n as Text).nodeValue!.match(/[^ \f\n\r\t\v]/)) {
                        // pure whitespace text node
                        var nxt = n.nextSibling;
                        e.removeChild(n);
                        n = nxt;
                    } else n = n.nextSibling;
                } else if (n.nodeType == 1) {
                    // element node
                    X.removeWhite(n as Element);
                    n = n.nextSibling;
                } // any other node
                else n = n.nextSibling;
            }
            return e;
        },
    };

    const parsedXml = new DOMParser().parseFromString(xml, "text/xml");
    const xmlElement = (parsedXml.nodeType == 9 ? parsedXml.documentElement : parsedXml) as Element;
    const json = X.toJson(X.toObj(X.removeWhite(xmlElement)), xmlElement.nodeName, "\t");
    return "{\n" + (tab || "") + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
};
