package com.franceschienterprises.universalmusicplayer;

import com.getcapacitor.JSObject;

public class JSObjectHelper {
    public static JSObject create(String key, Object value) {
        JSObject result = new JSObject();
        result.put(key, value);
        return result;
    }
}
