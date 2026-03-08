export function serializePrisma<T>(value: T): T {
    return JSON.parse(
        JSON.stringify(value, (_key, nestedValue) => {
            if (nestedValue instanceof Date) {
                return nestedValue.toISOString();
            }

            if (
                nestedValue &&
                typeof nestedValue === "object" &&
                typeof (nestedValue as { toNumber?: () => number }).toNumber === "function"
            ) {
                return (nestedValue as { toNumber: () => number }).toNumber();
            }

            return nestedValue;
        }),
    ) as T;
}
