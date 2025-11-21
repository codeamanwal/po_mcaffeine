const BASE_URL = 'http://localhost:8000/api/v1';

async function verify() {
    try {
        // 1. Login
        console.log("Logging in...");

        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@test.com',
                password: 'password123'
            })
        });

        if (!loginRes.ok) {
            const err = await loginRes.text();
            console.error("Login failed:", err);
            return;
        }

        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Login successful.");

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // 2. Upload Facility Master
        console.log("Uploading Facility Master...");
        const facilityData = [
            { facility: "Test Facility 1", pickupLocation: "Loc A" },
            { facility: "Test Facility 2", pickupLocation: "Loc B" }
        ];

        const uploadRes = await fetch(`${BASE_URL}/master/facility/upload`, {
            method: 'POST',
            headers,
            body: JSON.stringify(facilityData)
        });

        if (!uploadRes.ok) {
            const err = await uploadRes.text();
            throw new Error(`Upload failed: ${err}`);
        }
        console.log("Facility Master uploaded.");

        // 3. Get Facility Master
        console.log("Fetching Facility Master...");
        const getRes = await fetch(`${BASE_URL}/master/facility`, { headers });
        if (!getRes.ok) {
            const err = await getRes.text();
            throw new Error(`Get failed: ${err}`);
        }

        const getData = await getRes.json();
        console.log("Fetched data:", getData.data);

        if (getData.data.length !== 2) {
            throw new Error("Data length mismatch!");
        }

        // 4. Search Facility Master
        console.log("Searching Facility Master...");
        const searchRes = await fetch(`${BASE_URL}/master/facility/search?pickupLocation=Loc A`, { headers });
        if (!searchRes.ok) {
            const err = await searchRes.text();
            throw new Error(`Search failed: ${err}`);
        }
        const searchData = await searchRes.json();
        console.log("Search results:", searchData.data);

        if (searchData.data.length !== 1 || searchData.data[0].pickupLocation !== "Loc A") {
            throw new Error("Search result mismatch!");
        }
        console.log("Search verified.");

        // 5. Delete Facility Master
        console.log("Deleting Facility Master...");
        const deleteRes = await fetch(`${BASE_URL}/master/facility/delete`, {
            method: 'POST',
            headers
        });

        if (!deleteRes.ok) {
            const err = await deleteRes.text();
            throw new Error(`Delete failed: ${err}`);
        }
        console.log("Facility Master deleted.");

        // 5. Verify Deletion
        console.log("Verifying deletion...");
        const getRes2 = await fetch(`${BASE_URL}/master/facility`, { headers });
        const getData2 = await getRes2.json();

        if (getData2.data.length !== 0) {
            throw new Error("Delete failed, data still exists!");
        }
        console.log("Deletion verified.");

        console.log("Verification Successful!");

    } catch (error) {
        console.error("Verification failed:", error);
    }
}

// verify();
