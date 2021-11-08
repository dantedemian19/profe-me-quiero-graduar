package com.profe_me_quiero_graduar.app.domain.enumeration;

/**
 * The StarCalification enumeration.
 */
public enum StarCalification {
    One("one"),
    Two("two"),
    Three("three"),
    Four("four"),
    Five("five");

    private final String value;

    StarCalification(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
