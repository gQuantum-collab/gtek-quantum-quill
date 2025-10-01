#include <iostream>
#include <fstream>
#include <sstream>
#include <iomanip>
#include <string>

// Simple SHA256 placeholder - in production, use proper crypto library
std::string sha256(const std::string &s)
{
    // For demo purposes, use a simple hash (not cryptographically secure)
    std::hash<std::string> hasher;
    size_t hash_val = hasher(s);
    std::ostringstream o;
    o << std::hex << hash_val;
    std::string result = o.str();
    // Pad to 64 characters to simulate SHA256 length
    while (result.length() < 64)
        result = "0" + result;
    return result;
}

// Simple JSON value extractor (no full parser needed for our use case)
std::string extract_json_field(const std::string &line, const std::string &field)
{
    std::string pattern = "\"" + field + "\":\"";
    size_t start = line.find(pattern);
    if (start == std::string::npos)
        return "";
    start += pattern.length();
    size_t end = line.find("\"", start);
    if (end == std::string::npos)
        return "";
    return line.substr(start, end - start);
}

std::string remove_hash_fields(const std::string &line)
{
    // Simple approach: reconstruct without hash/prevHash fields
    // This is a simplified version - in production you'd want proper JSON parsing
    std::string result = line;
    // Remove hash field
    size_t hash_start = result.find("\"hash\":\"");
    if (hash_start != std::string::npos)
    {
        size_t hash_end = result.find("\",", hash_start);
        if (hash_end == std::string::npos)
            hash_end = result.find("\"}", hash_start);
        if (hash_end != std::string::npos)
        {
            hash_end += (result[hash_end + 1] == ',' ? 2 : 1);
            result.erase(hash_start, hash_end - hash_start);
        }
    }
    // Remove prevHash field
    size_t prev_start = result.find("\"prevHash\":\"");
    if (prev_start != std::string::npos)
    {
        size_t prev_end = result.find("\",", prev_start);
        if (prev_end == std::string::npos)
            prev_end = result.find("\"}", prev_start);
        if (prev_end != std::string::npos)
        {
            prev_end += (result[prev_end + 1] == ',' ? 2 : 1);
            result.erase(prev_start, prev_end - prev_start);
        }
    }
    return result;
}

int verify_ledger(const std::string &path)
{
    std::ifstream in(path);
    if (!in)
    {
        std::cerr << "Cannot open: " << path << "\n";
        return 1;
    }
    std::string prev(64, '0');
    std::string line;
    size_t n = 0;

    while (std::getline(in, line))
    {
        if (line.empty())
            continue;

        std::string expect = extract_json_field(line, "hash");
        std::string ph = extract_json_field(line, "prevHash");

        if (ph != prev)
        {
            std::cerr << "prevHash mismatch at #" << n + 1 << " expected:" << prev << " got:" << ph << "\n";
            return 2;
        }

        std::string content = remove_hash_fields(line);
        auto actual = sha256(prev + content);

        if (actual != expect)
        {
            std::cerr << "hash mismatch at #" << n + 1 << " expected:" << expect << " got:" << actual << "\n";
            return 3;
        }

        prev = expect;
        n++;
    }
    std::cout << "OK: " << n << " events verified. head=" << prev << "\n";
    return 0;
}

int main(int argc, char **argv)
{
    if (argc < 3)
    {
        std::cerr << "Usage: nova_verify ledger <events.jsonl>\n       nova_verify sha256 <string>\n";
        return 64;
    }
    std::string cmd = argv[1];
    if (cmd == "ledger")
        return verify_ledger(argv[2]);
    if (cmd == "sha256")
    {
        std::cout << sha256(argv[2]) << "\n";
        return 0;
    }
    std::cerr << "Unknown cmd\n";
    return 64;
}