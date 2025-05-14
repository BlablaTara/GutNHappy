export async function fetchGet(url) {
    try {
        const response = await fetch(url, {
            credentials: "include",
        });

        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
            if (contentType && contentType.includes("application/json")) {
                const result = await response.json();
                console.error("Fetch GET error:", result);
                return { error: result.error || 'Something went wrong', status: response.status };
            } else {
                const text = await response.text(); 
                console.error("Fetch GET error (non-JSON):", text);
                return { error: text || 'Something went wrong', status: response.status };
            }
        }

        if (contentType && contentType.includes("application/json")) {
            //return await response.json();
            const json = await response.json(); // log
            console.log(" Successful fetch GET response:", json); // log
            return json;// log
        } else {
            //return await response.text();
            const text = await response.text(); // log
            console.log(" Successful fetch GET text response:", text); // log
            return { data: text };// log
        }

    } catch (error) {
        console.error('Fetch GET error:', error);
        return { error: "Network error" };  
    }
}


export async function fetchPost(url, body) {
    try {
        console.log("Sending POST to", url); //log
        console.log("Request body:", body); // log

        const response = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        console.log("Raw response:", response); // log
        console.log("Parsed body:", result); // log

        if (!response.ok) {
            console.error("Response error:", result);
            return { error: result.error || 'Something went wrong', status: response.status };
        }
        return result;
        
    } catch (error) {
        console.error('Fetch POST error (network?):', error);
        return { error: "Network error" };
    }

};