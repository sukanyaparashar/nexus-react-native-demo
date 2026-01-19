import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

import { Buffer } from "buffer";
(global as any).Buffer = (global as any).Buffer || Buffer;

(global as any).process = (global as any).process || require("process");
