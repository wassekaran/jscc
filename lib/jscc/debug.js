/*
 * Universal module definition for debug.
 */
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['./global', './io/io'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('./global'), require('./io/io'));
    } else {
        root.debug = factory(root.global, root.io);
    }
}(this, function(/** module:jscc/global */ global,
                 /** io */ io) {
    /**
     * Debugging-output functions.
     * @module jscc/debug
     * @requires module:jscc/global
     * @requires module:jscc/io/io
     */
    return {
        /**
         * Prints debugging output related to the current value of the
         * {@link module:jscc/global.symbols} array.
         * @param {module:jscc/global.MODE_GEN} mode - The current output mode.
         * @memberof module:jscc/debug
         */
        print_symbols: function(mode) {
            if (mode == global.MODE_GEN.HTML) {
                io._print("<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">");
                io._print("<tr>");
                io._print("<td class=\"tabtitle\" colspan=\"3\">Symbols Overview</td>");
                io._print("</tr>");
                io._print("<tr>");
                io._print("<td class=\"coltitle\">Symbol</td>");
                io._print("<td class=\"coltitle\">Type</td>");
                io._print("</tr>");
            } else if (mode == global.MODE_GEN.TEXT) {
                io._print("--- Symbol Dump ---");
            }

            for (var i = 0; i < global.symbols.length; i++) {
                if (mode == global.MODE_GEN.HTML) {
                    io._print("<tr>");

                    io._print("<td>");
                    io._print(global.symbols[i].label);
                    io._print("</td>");

                    io._print("<td>");
                    io._print(((global.symbols[i].kind == global.SYM.NONTERM) ? "Non-terminal" : "Terminal"));
                    io._print("</td>");
                } else if (mode == global.MODE_GEN.TEXT) {
                    var output = new String();

                    output = global.symbols[i].label;
                    for (var j = output.length; j < 20; j++) {
                        output += " ";
                    }

                    output += ((global.symbols[i].kind == global.SYM.NONTERM) ? "Non-terminal" : "Terminal");

                    if (global.symbols[i].kind == global.SYM.TERM) {
                        for (var j = output.length; j < 40; j++) {
                            output += " ";
                        }
                        output += global.symbols[i].level + "/";

                        switch (global.symbols[i].assoc) {
                            case global.ASSOC.NONE:
                                output += "^";
                                break;
                            case global.ASSOC.LEFT:
                                output += "<";
                                break;
                            case global.ASSOC.RIGHT:
                                output += ">";
                                break;
                        }
                    }

                    io._print(output);
                }
            }

            if (mode == global.MODE_GEN.HTML) {
                io._print("</table>");
            } else if (mode == global.MODE_GEN.TEXT) {
                io._print("");
            }
        },

        /**
         * Prints debugging output related to the grammar being processed,
         * using information from the {@link module:jscc/global.symbols} and
         * {@link module:jscc/global.productions} arrays.
         * @param {module:jscc/global.MODE_GEN} mode - The current output mode.
         * @memberof module:jscc/debug
         */
        print_grammar: function(mode) {
            if (mode == global.MODE_GEN.HTML) {
                io._print("<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">");
                io._print("<tr>");
                io._print("<td class=\"tabtitle\" colspan=\"3\">Grammar Overview</td>");
                io._print("</tr>");
                io._print("<tr>");
                io._print("<td class=\"coltitle\">Left-hand side</td>");
                io._print("<td class=\"coltitle\">FIRST-set</td>");
                io._print("<td class=\"coltitle\">Right-hand side</td>");
                io._print("</tr>");

                for (var i = 0; i < global.symbols.length; i++) {
                    io._print("<tr>");

                    if (global.symbols[i].kind == global.SYM.NONTERM) {
                        io._print("<td>");
                        io._print(global.symbols[i].label);
                        io._print("</td>");

                        io._print("<td>");
                        for (var j = 0; j < global.symbols[i].first.length; j++) {
                            io._print("<b>" + global.symbols[global.symbols[i].first[j]].label + "</b>");
                        }
                        io._print("</td>");

                        io._print("<td>");
                        for (var j = 0; j < global.symbols[i].prods.length; j++) {
                            for (var k = 0; k < global.productions[symbols[i].prods[j]].rhs.length; k++) {
                                if (global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].kind ==
                                    global.SYM.TERM) {
                                    io._print("<b>" +
                                              global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                              "</b>");
                                } else {
                                    io._print(" " +
                                              global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                              " ");
                                }
                            }
                            io._print("<br />");
                        }
                        io._print("</td>");
                    }
                    io._print("</tr>");
                }
                io._print("</table>");
            } else if (mode == global.MODE_GEN.TEXT) {
                var output = new String();

                for (var i = 0; i < global.symbols.length; i++) {
                    if (global.symbols[i].kind == global.SYM.NONTERM) {
                        output += global.symbols[i].label + " {";

                        for (var j = 0; j < global.symbols[i].first.length; j++) {
                            output += " " + global.symbols[symbols[i].first[j]].label + " ";
                        }

                        output += "}\n";

                        for (var j = 0; j < global.symbols[i].prods.length; j++) {
                            output += "\t";
                            for (var k = 0; k < global.productions[global.symbols[i].prods[j]].rhs.length; k++) {
                                if (global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].kind ==
                                    global.SYM.TERM) {
                                    output += "#" +
                                              global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                              " ";
                                } else {
                                    output +=
                                        global.symbols[global.productions[global.symbols[i].prods[j]].rhs[k]].label +
                                        " ";
                                }
                            }
                            output += "\n";
                        }
                    }
                }

                io._print(output);
            }
        },

        /**
         * Prints debugging information relating to the provided array
         * of Item objects.
         * @param {module:jscc/global.MODE_GEN} mode - The current output mode.
         * @param {string} label - A label for the debugging output.
         * @param {Array.<module:jscc/global.Item>} item_set - The items for which to print information.
         * @memberof module:jscc/debug
         */
        print_item_set: function(mode, label, item_set) {
            var i, j;

            if (item_set.length == 0) {
                return;
            }

            if (mode == global.MODE_GEN.HTML) {
                io._print("<table class=\"debug\" cellpadding=\"0\" cellspacing=\"0\">");
                io._print("<tr>");
                io._print("<td class=\"tabtitle\" colspan=\"2\">" + label + "</td>");
                io._print("</tr>");
                io._print("<tr>");
                io._print("<td class=\"coltitle\" width=\"35%\">Lookahead</td>");
                io._print("<td class=\"coltitle\" width=\"65%\">Production</td>");
                io._print("</tr>");
            } else if (mode == global.MODE_GEN.TEXT) {
                io._print("--- " + label + " ---");
            }

            for (i = 0; i < item_set.length; i++) {
                if (mode == global.MODE_GEN.HTML) {
                    io._print("<tr>");
                    io._print("<td>");
                    for (j = 0; j < item_set[i].lookahead.length; j++) {
                        io._print("<b>" + global.symbols[item_set[i].lookahead[j]].label + "</b> ");
                    }
                    io._print("</td>");

                    io._print("<td>");
                    io._print(global.symbols[global.productions[item_set[i].prod].lhs].label + " -&gt; ");
                    for (j = 0; j < global.productions[item_set[i].prod].rhs.length; j++) {
                        if (j == item_set[i].dot_offset) {
                            io._print(".");
                        }

                        if (global.symbols[global.productions[item_set[i].prod].rhs[j]].kind == global.SYM.TERM) {
                            io._print("<b>" + global.symbols[global.productions[item_set[i].prod].rhs[j]].label +
                                      "</b>");
                        } else {
                            io._print(" " + global.symbols[global.productions[item_set[i].prod].rhs[j]].label + " ");
                        }
                    }

                    if (j == item_set[i].dot_offset) {
                        io._print(".");
                    }
                    io._print("</td>");
                    io._print("</tr>");
                } else if (mode == global.MODE_GEN.TEXT) {
                    var out = new String();

                    out += global.symbols[global.productions[item_set[i].prod].lhs].label;

                    for (j = out.length; j < 20; j++) {
                        out += " ";
                    }

                    out += " -> ";

                    for (j = 0; j < global.productions[item_set[i].prod].rhs.length; j++) {
                        if (j == item_set[i].dot_offset) {
                            out += ".";
                        }
                        if (global.symbols[global.productions[item_set[i].prod].rhs[j]].kind == global.SYM.TERM) {
                            out += " #" + global.symbols[global.productions[item_set[i].prod].rhs[j]].label + " ";
                        } else {
                            out += " " + global.symbols[global.productions[item_set[i].prod].rhs[j]].label + " ";
                        }
                    }

                    if (j == item_set[i].dot_offset) {
                        out += ".";
                    }

                    for (j = out.length; j < 60; j++) {
                        out += " ";
                    }
                    out += "{ ";

                    for (j = 0; j < item_set[i].lookahead.length; j++) {
                        out += "#" + global.symbols[item_set[i].lookahead[j]].label + " ";
                    }

                    out += "}";

                    io._print(out);
                }
            }

            if (mode == global.MODE_GEN.HTML) {
                io._print("</table>");
            }
        }
    };
}));