
// Mocking the logic from the controller for verification
function testLogic(query) {
    let attributes = query.attributes;
    const queryCopy = { ...query };

    // Handle attributes parsing
    if (attributes) {
        if (typeof attributes === 'string') {
            if (attributes.includes(',')) {
                attributes = attributes.split(',').map(attr => attr.trim());
            } else {
                attributes = [attributes];
            }
        }
        // If it's already an array, we leave it as is
        delete queryCopy.attributes; // Remove attributes from query used for filtering
    }

    // Remove empty query parameters
    Object.keys(queryCopy).forEach(key => {
        if (queryCopy[key] === '' || queryCopy[key] === undefined || queryCopy[key] === null) {
            delete queryCopy[key];
        }
    });

    return { attributes, query: queryCopy };
}

// Test cases
const testCases = [
    {
        name: "String with commas",
        input: { attributes: "id, name", status: "active" },
        expected: { attributes: ["id", "name"], query: { status: "active" } }
    },
    {
        name: "Single string",
        input: { attributes: "id", status: "active" },
        expected: { attributes: ["id"], query: { status: "active" } }
    },
    {
        name: "Array",
        input: { attributes: ["id", "name"], status: "active" },
        expected: { attributes: ["id", "name"], query: { status: "active" } }
    },
    {
        name: "No attributes",
        input: { status: "active" },
        expected: { attributes: undefined, query: { status: "active" } }
    },
    {
        name: "Empty params cleanup",
        input: { attributes: "id", status: "", type: null },
        expected: { attributes: ["id"], query: {} }
    }
];

let passed = true;
testCases.forEach(test => {
    const result = testLogic(test.input);
    const attributesMatch = JSON.stringify(result.attributes) === JSON.stringify(test.expected.attributes);
    const queryMatch = JSON.stringify(result.query) === JSON.stringify(test.expected.query);

    if (attributesMatch && queryMatch) {
        console.log(`[PASS] ${test.name}`);
    } else {
        console.log(`[FAIL] ${test.name}`);
        console.log("Expected:", test.expected);
        console.log("Got:", result);
        passed = false;
    }
});

if (passed) {
    console.log("\nAll tests passed!");
} else {
    console.error("\nSome tests failed.");
    process.exit(1);
}
