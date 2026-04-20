//
// MCPBuiltinTools.cpp
//
// All Phase 5 read/schema tools. Tier-3 write tools (insert_rows,
// update_rows, delete_rows, execute_write_query) land in Round 1B.

#include "MCPBuiltinTools.h"
#include "Tier1/ListConnectionsTool.h"
#include "Tier1/ListTablesTool.h"
#include "Tier1/DescribeTableTool.h"
#include "Tier1/ListSchemasTool.h"
#include "Tier1/ListRelationshipsTool.h"
#include "Tier1/GetSampleRowsTool.h"
#include "Tier2/QueryTool.h"
#include "Tier2/ExplainQueryTool.h"
#include "Tier2/SearchAcrossTablesTool.h"

namespace DBModels { namespace MCPBuiltinTools {

void registerAll(MCPToolRegistry& r)
{
    // Tier 1 — schema introspection (available in any non-Locked mode).
    r.registerTool(std::make_shared<ListConnectionsTool>());
    r.registerTool(std::make_shared<ListTablesTool>());
    r.registerTool(std::make_shared<DescribeTableTool>());
    r.registerTool(std::make_shared<ListSchemasTool>());
    r.registerTool(std::make_shared<ListRelationshipsTool>());
    r.registerTool(std::make_shared<GetSampleRowsTool>());

    // Tier 2 — read queries (ReadOnly allowed, ReadWrite too).
    r.registerTool(std::make_shared<QueryTool>());
    r.registerTool(std::make_shared<ExplainQueryTool>());
    r.registerTool(std::make_shared<SearchAcrossTablesTool>());

    // Tier 3 — write tools arrive in Round 1B.
}

}} // namespace
