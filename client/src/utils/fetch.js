export async function fetchGet(url) {
  try {
    const response = await fetch(url, {
      credentials: "include",
    });

    const result = await response.json();

    return result;
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function fetchPost(url, body) {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    result.status = response.status;
    return result;
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function fetchPut(url, body) {
  try {
    const response = await fetch(url, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const result = await response.json();
    
    result.status = response.status;
    return result;
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function fetchDelete(url) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, ...result };
    }

    return { success: true, ...result };
  } catch {
    return { success: false };
  }
}


